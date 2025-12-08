/**
 * Service responsável por toda a lógica de negócio de pedidos.
 * Implementa criação, validação, cálculo de totais, uso de cupom e envio de email de confirmação.
 */
import { prisma } from '@config/database';
import { CreateOrderDTO } from '../types/order.types';
import { BadRequestError } from '@utils/errors';
import { CouponService } from './coupon.service';
import { emailService } from './email.service';
import { logger } from '@config/logger.colored';
import { pagbankService } from './pagbank.service';
import { inventoryService } from './inventory.service';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class OrderService {
  private couponService = new CouponService();

  /**
   * Cria um novo pedido
   */
  async createOrder(userId: string, data: CreateOrderDTO) {
    return await prisma.$transaction(async (tx) => {
      // 1. Buscar usuário
      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!user) throw new BadRequestError('Usuário não encontrado');

      // 2. Buscar endereço
      const address = await tx.address.findUnique({
        where: { id: data.addressId }
      });

      if (!address || address.userId !== userId) {
        throw new BadRequestError('Endereço inválido');
      }

      // 3. Buscar produtos
      const products = await tx.product.findMany({
        where: {
          id: { in: data.items.map(i => i.productId) }
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          dimensions: true,
        },
      });

      // 3.1. Validar estoque disponível (sem reservar ainda)
      const stockValidation = await inventoryService.validateStockAvailability(
        data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }))
      );

      if (!stockValidation.available) {
        const unavailable = stockValidation.unavailableItems[0];
        const product = products.find(p => p.id === unavailable.productId);
        throw new BadRequestError(
          `Estoque insuficiente para ${product?.name}. Disponível: ${unavailable.availableQuantity}, Solicitado: ${unavailable.requestedQuantity}`
        );
      }

      // 4. Calcular subtotal
      const subtotal = this.calculateSubtotal(products, data.items);

      // 5. Calcular frete
      const shippingMethod = await tx.shippingMethod.findUnique({
        where: { id: data.shippingMethodId }
      });

      if (!shippingMethod) {
        throw new BadRequestError('Método de envio inválido');
      }

      const shippingCost = await this.calculateShippingCost(
        products,
        data.items,
        shippingMethod,
        subtotal
      );

      // 6. Aplicar cupom (se houver)
      let discount = 0;
      let couponId: string | null = null;

      if (data.couponCode) {
        const couponResult = await this.couponService.applyCoupon(
          data.couponCode,
          subtotal
        );
        discount = couponResult.discountAmount;

        // Buscar ID do cupom para incrementar uso depois
        const coupon = await tx.coupon.findUnique({
          where: { code: data.couponCode.toUpperCase() }
        });
        couponId = coupon?.id || null;
      }

      // 7. Calcular total
      const total = subtotal + shippingCost - discount;

      // 8. Gerar número do pedido
      const orderNumber = await this.generateOrderNumber(tx);

      // 9. Calcular prazo estimado
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(
        estimatedDelivery.getDate() + shippingMethod.maxDays
      );

      // 10. Criar pedido (PENDING - aguardando pagamento)
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: data.addressId,
          
          // Snapshots - usa dados do destinatário se fornecidos, senão usa do usuário
          customerName: data.receiverName || `${user.firstName} ${user.lastName}`,
          customerEmail: user.email,
          customerPhone: data.receiverPhone || user.phone || '',

          // Valores
          subtotal,
          shippingCost,
          discount,
          total,

          // Envio
          shippingMethod: shippingMethod.name,
          estimatedDelivery,

          // Pagamento
          paymentMethod: data.paymentMethod,
          firstPaymentAttemptAt: new Date(), // Primeira tentativa

          // Cupom
          couponCode: data.couponCode?.toUpperCase(),

          // Observações
          notes: data.notes,

          // Itens
          items: {
            create: data.items.map(item => {
              const product = products.find(p => p.id === item.productId)!;
              const unitPrice = Number(product.price);
              
              // Pegar primeira imagem ou null
              const firstImage = product.images && product.images.length > 0
                ? (product.images[0] as any).url
                : null;
              
              return {
                productId: item.productId,
                productName: product.name,
                productImage: firstImage,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                unitPrice,
                totalPrice: unitPrice * item.quantity
              };
            })
          }
        },
        include: {
          items: true,
          address: true
        }
      });

      // 11. Processar pagamento
      const paymentMethod = data.paymentMethod === 'credit_card' 
        ? PaymentMethod.CREDIT_CARD 
        : PaymentMethod.PIX;

      // 11.1. Criar registro de Payment
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          method: paymentMethod,
          amount: total,
          attemptNumber: 1,
          status: PaymentStatus.PENDING,
        },
      });

      // 11.2. Processar via PagBank
      let paymentResult;
      const paymentData = {
        orderId: order.orderNumber,
        amount: Number(total),
        method: data.paymentMethod === 'credit_card' ? 'CREDIT_CARD' as const : 'PIX' as const,
        customer: {
          name: order.customerName,
          email: user.email,
          cpf: user.cpf || '00000000000', // CPF obrigatório - deve ser validado no cadastro
          phone: order.customerPhone,
        },
        address: {
          street: address.street,
          number: address.number,
          complement: address.complement,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
        },
        items: data.items.map(item => {
          const product = products.find(p => p.id === item.productId)!;
          return {
            name: product.name,
            quantity: item.quantity,
            unitAmount: Number(product.price),
          };
        }),
        creditCard: data.creditCard,
      };

      if (data.paymentMethod === 'credit_card') {
        if (!data.creditCard) {
          throw new BadRequestError('Dados do cartão são obrigatórios');
        }
        paymentResult = await pagbankService.createCreditCardCharge(paymentData);
      } else {
        paymentResult = await pagbankService.createPixCharge(paymentData);
      }

      // 11.3. Atualizar Payment com resultado
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          chargeId: paymentResult.chargeId,
          status: paymentResult.success ? PaymentStatus.APPROVED : PaymentStatus.DECLINED,
          pixQrCode: paymentResult.pixQrCode,
          pixQrCodeBase64: paymentResult.pixQrCodeImage,
          pixExpiresAt: paymentResult.pixExpiresAt,
          errorMessage: paymentResult.errorMessage,
        },
      });

      // 11.4. Gerenciar estoque baseado no método de pagamento
      if (paymentResult.success) {
        if (data.paymentMethod === 'pix') {
          // PIX: Reservar estoque por 15 minutos
          await inventoryService.reserveStockForPix(
            order.id,
            data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            }))
          );
        } else {
          // Cartão aprovado: Decrementar estoque imediatamente
          await inventoryService.decrementStockForOrder(
            order.id,
            data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            }))
          );
          
          // Atualizar status do pedido para PAID
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              paymentStatus: 'APPROVED',
              paidAt: new Date(),
            },
          });
        }
      }

      // 12. Incrementar uso do cupom
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: {
            usageCount: { increment: 1 }
          }
        });
      }

      // 13. Limpar carrinho APENAS se pagamento foi aprovado ou é PIX (aguardando)
      if (paymentResult.success) {
        await tx.cartItem.deleteMany({
          where: {
            cart: {
              userId
            },
            productId: {
              in: data.items.map(i => i.productId)
            }
          }
        });
      }

      // 14. Enviar email de confirmação (não bloqueia se falhar)
      emailService
        .sendOrderConfirmation({
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          orderNumber: order.orderNumber,
          orderDate: order.createdAt,
          items: order.items.map(item => ({
            productName: item.productName,
            size: item.size || undefined,
            color: item.color || undefined,
            quantity: item.quantity,
            price: Number(item.unitPrice),
          })),
          subtotal: Number(order.subtotal),
          shippingCost: Number(order.shippingCost),
          discount: Number(order.discount),
          total: Number(order.total),
          shippingAddress: {
            receiverName: order.customerName, // Nome do destinatário do pedido
            receiverPhone: order.customerPhone, // Telefone do destinatário do pedido
            street: address.street,
            number: address.number,
            complement: address.complement || undefined,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
          },
          paymentMethod: data.paymentMethod,
        })
        .catch((error) => {
          logger.error('Failed to send order confirmation email', {
            orderId: order.id,
            error,
          });
        });

      // Return order with payment data for frontend
      return {
        ...order,
        payment: {
          status: paymentResult.paymentStatus,
          pixQrCode: paymentResult.pixQrCode,
          pixQrCodeBase64: paymentResult.pixQrCodeBase64,
          pixExpiresAt: paymentResult.pixExpiresAt,
          errorMessage: paymentResult.errorMessage,
        },
      };
    });
  }

  /**
   * Lista pedidos do usuário
   */
  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Busca um pedido específico
   */
  async getOrderById(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true
      }
    });

    if (!order) {
      throw new BadRequestError('Pedido não encontrado');
    }

    // Se userId fornecido, validar propriedade
    if (userId && order.userId !== userId) {
      throw new BadRequestError('Pedido não encontrado');
    }

    return order;
  }

  /**
   * Cancela um pedido
   */
  async cancelOrder(userId: string, orderId: string, reason: string) {
    const order = await this.getOrderById(orderId, userId);

    // Só pode cancelar se estiver PENDING ou PAID
    if (!['PENDING', 'PAID'].includes(order.status)) {
      throw new BadRequestError('Pedido não pode ser cancelado');
    }

    // Retornar estoque
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity }
          }
        });
      }

      // Atualizar pedido
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: reason
        }
      });
    });

    return { success: true };
  }

  // ============ MÉTODOS PRIVADOS ============

  private validateStock(products: any[], items: any[]) {
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      
      if (!product) {
        throw new BadRequestError(`Produto não encontrado: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestError(
          `Estoque insuficiente para ${product.name}`
        );
      }
    }
  }

  private calculateSubtotal(products: any[], items: any[]): number {
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)!;
      return total + (Number(product.price) * item.quantity);
    }, 0);
  }

  private async calculateShippingCost(
    products: any[],
    items: any[],
    method: any,
    cartTotal: number
  ): Promise<number> {
    // Verifica frete grátis
    if (method.freeAbove && cartTotal >= Number(method.freeAbove)) {
      return 0;
    }

    // Calcula peso total
    const totalWeight = items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)!;
      const weight = product.weight ? Number(product.weight) : 0.5;
      return total + (weight * item.quantity);
    }, 0);

    // Aplica fórmula
    let cost = Number(method.baseCost);
    if (totalWeight > 1) {
      cost += Number(method.perKgCost) * (totalWeight - 1);
    }

    return cost;
  }

  private async generateOrderNumber(tx: any): Promise<string> {
    const year = new Date().getFullYear();
    
    // Busca último pedido do ano
    const lastOrder = await tx.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `NSR-${year}-`
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    let sequence = 1;
    if (lastOrder) {
      const parts = lastOrder.orderNumber.split('-');
      sequence = parseInt(parts[2]) + 1;
    }

    return `NSR-${year}-${sequence.toString().padStart(4, '0')}`;
  }
}
