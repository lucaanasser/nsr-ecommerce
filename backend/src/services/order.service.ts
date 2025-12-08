/**
 * Service responsável por toda a lógica de negócio de pedidos.
 * Implementa criação, validação, cálculo de totais, uso de cupom e envio de email de confirmação.
 */
import { prisma } from '@config/database';
import { CreateOrderDTO } from '../types/order.types';
import { BadRequestError, NotFoundError } from '@utils/errors';
import { CouponService } from './coupon.service';
import { emailService } from './email.service';
import { logger } from '@config/logger.colored';
import { pagbankService } from './pagbank.service';
import { inventoryService } from './inventory.service';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import type { ChargeStatus } from '../types/pagbank.types';

export class OrderService {
  private couponService = new CouponService();

  /**
   * Map PagBank ChargeStatus to Prisma PaymentStatus
   */
  private mapChargeStatusToPaymentStatus(status: ChargeStatus): PaymentStatus {
    const statusMap: Record<ChargeStatus, PaymentStatus> = {
      WAITING: PaymentStatus.WAITING,
      IN_ANALYSIS: PaymentStatus.IN_ANALYSIS,
      PAID: PaymentStatus.PAID,
      AVAILABLE: PaymentStatus.WAITING, // Map AVAILABLE to WAITING
      IN_DISPUTE: PaymentStatus.IN_ANALYSIS,
      RETURNED: PaymentStatus.REFUNDED,
      CANCELED: PaymentStatus.CANCELED,
      DECLINED: PaymentStatus.DECLINED,
      AUTHORIZED: PaymentStatus.AUTHORIZED,
    };
    return statusMap[status] || PaymentStatus.PENDING;
  }

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
        if (unavailable) {
          const product = products.find(p => p.id === unavailable.productId);
          throw new BadRequestError(
            `Estoque insuficiente para ${product?.name}. Disponível: ${unavailable.availableQuantity}, Solicitado: ${unavailable.requestedQuantity}`
          );
        }
        throw new BadRequestError('Estoque insuficiente para alguns produtos');
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

      // 11.2. Reservar estoque (ANTES de chamar o gateway)
      // Isso garante que o estoque existe e está reservado.
      // Se falhar, a transação inteira é abortada.
      await inventoryService.reserveStock(
        order.id,
        data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        tx // Passar a transação atual
      );

      // 11.3. Processar via PagBank
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
          complement: address.complement || undefined,
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

      // 11.4. Atualizar Payment com resultado
      const mappedStatus = pagbankService.mapChargeStatusToPaymentStatus(paymentResult.status);
      
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          chargeId: paymentResult.chargeId,
          status: mappedStatus as PaymentStatus,
          pixQrCode: paymentResult.pixQrCode,
          pixQrCodeBase64: paymentResult.pixQrCodeImage,
          pixExpiresAt: paymentResult.pixExpiresAt,
          errorMessage: paymentResult.errorMessage,
        },
      });

      // 11.5. Atualizar status do pedido se aprovado (Cartão)
      if (paymentResult.success && data.paymentMethod === 'credit_card') {
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

      // Se o pagamento falhar, lançamos erro para abortar a transação (e liberar o estoque)
      if (!paymentResult.success) {
        throw new BadRequestError(paymentResult.errorMessage || 'Falha no processamento do pagamento');
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
          status: paymentResult.status,
          pixQrCode: paymentResult.pixQrCode,
          pixQrCodeBase64: paymentResult.pixQrCodeImage,
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

  /**
   * Retry payment for a pending order
   */
  async retryPayment(
    userId: string,
    orderId: string,
    paymentData: { paymentMethod: string; creditCard?: any }
  ) {
    // Verify order belongs to user and is in valid state
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: 'PENDING',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: true,
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Pedido não encontrado ou não está pendente');
    }

    // Check if within 24h window
    const firstAttempt = new Date(order.firstPaymentAttemptAt!);
    const hoursSinceFirstAttempt =
      (Date.now() - firstAttempt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceFirstAttempt > 24) {
      throw new BadRequestError(
        'Prazo de 24h para pagamento expirado. Crie um novo pedido.'
      );
    }

    // Get last payment attempt number
    const lastPayment = order.payments[0];
    const attemptNumber = lastPayment ? lastPayment.attemptNumber + 1 : 2;

    logger.info('Retrying payment for order', {
      orderId,
      attemptNumber,
      paymentMethod: paymentData.paymentMethod,
    });

    // Validate stock availability (without reserving yet)
    await inventoryService.validateStockAvailability(
      order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        size: item.size || undefined,
        color: item.color || undefined,
      }))
    );

    // Create new payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        method:
          paymentData.paymentMethod === 'pix'
            ? PaymentMethod.PIX
            : PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.PENDING,
        amount: order.total,
        attemptNumber,
        stockReserved: false,
      },
    });

    let paymentResult;

    try {
      // Process payment via PagBank
      if (paymentData.paymentMethod === 'pix') {
        paymentResult = await pagbankService.createPixCharge({
          orderId: order.id,
          amount: Number(order.total),
          method: 'PIX' as const,
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpf: order.user.cpf || '',
            phone: order.customerPhone,
          },
          address: {
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
          },
          items: order.items.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            unitAmount: Number(item.unitPrice),
          })),
        });
      } else {
        // Credit card
        if (!paymentData.creditCard) {
          throw new BadRequestError(
            'Dados do cartão são obrigatórios para pagamento com cartão'
          );
        }

        paymentResult = await pagbankService.createCreditCardCharge({
          orderId: order.id,
          amount: Number(order.total),
          method: 'CREDIT_CARD' as const,
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpf: order.user.cpf || '',
            phone: order.customerPhone,
          },
          address: {
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
          },
          items: order.items.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            unitAmount: Number(item.unitPrice),
          })),
          creditCard: paymentData.creditCard,
        });
      }

      // Update payment with results
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          chargeId: paymentResult.chargeId,
          status: this.mapChargeStatusToPaymentStatus(paymentResult.status),
          pixQrCode: paymentResult.pixQrCode,
          pixQrCodeBase64: paymentResult.pixQrCodeImage,
          pixExpiresAt: paymentResult.pixExpiresAt,
          errorMessage: paymentResult.errorMessage,
        },
      });

      // Handle stock based on payment method and result
      if (paymentResult.success) {
        if (paymentData.paymentMethod === 'pix') {
          // Reserve stock for PIX (15 minutes)
          await inventoryService.reserveStock(
            order.id,
            order.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size || undefined,
              color: item.color || undefined,
            }))
          );
          await prisma.payment.update({
            where: { id: payment.id },
            data: { stockReserved: true },
          });
        } else if (paymentResult.status === 'PAID') {
          // Credit card approved - decrement stock immediately
          await inventoryService.reserveStock(
            order.id,
            order.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size || undefined,
              color: item.color || undefined,
            }))
          );
          await prisma.payment.update({
            where: { id: payment.id },
            data: { stockReserved: true },
          });
          
          // Update order status
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'CONFIRMED' },
          });
        }
      }

      logger.info('Payment retry processed', {
        orderId,
        paymentId: payment.id,
        success: paymentResult.success,
        status: paymentResult.status,
      });

      return {
        orderId: order.id,
        paymentId: payment.id,
        status: paymentResult.status,
        pixQrCode: paymentResult.pixQrCode,
        pixQrCodeBase64: paymentResult.pixQrCodeImage,
        pixExpiresAt: paymentResult.pixExpiresAt,
        errorMessage: paymentResult.errorMessage,
      };
    } catch (error) {
      logger.error('Failed to retry payment', {
        orderId,
        paymentId: payment.id,
        error,
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.DECLINED,
          errorMessage:
            error instanceof Error ? error.message : 'Erro ao processar pagamento',
        },
      });

      throw error;
    }
  }

  /**
   * Get payment status for an order
   */
  async getPaymentStatus(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Pedido não encontrado');
    }

    const lastPayment = order.payments[0];

    if (!lastPayment) {
      throw new NotFoundError('Nenhum pagamento encontrado para este pedido');
    }

    // Check if payment can be retried
    const firstAttempt = new Date(order.firstPaymentAttemptAt!);
    const hoursSinceFirstAttempt =
      (Date.now() - firstAttempt.getTime()) / (1000 * 60 * 60);
    const canRetry =
      order.status === 'PENDING' &&
      hoursSinceFirstAttempt <= 24 &&
      lastPayment.status !== PaymentStatus.PAID;

    return {
      orderId: order.id,
      orderStatus: order.status,
      orderNumber: order.orderNumber,
      totalAmount: order.total,
      payment: {
        id: lastPayment.id,
        method: lastPayment.method,
        status: lastPayment.status,
        attemptNumber: lastPayment.attemptNumber,
        pixQrCode: lastPayment.pixQrCode,
        pixQrCodeBase64: lastPayment.pixQrCodeBase64,
        pixExpiresAt: lastPayment.pixExpiresAt,
        errorMessage: lastPayment.errorMessage,
        createdAt: lastPayment.createdAt,
      },
      canRetry,
      retryDeadline: new Date(
        firstAttempt.getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  }
}
