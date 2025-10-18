import { prisma } from '@config/database';
import { CreateOrderDTO } from '../types/order.types';
import { BadRequestError } from '@utils/errors';
import { CouponService } from './coupon.service';
import { emailService } from './email.service';
import { logger } from '@config/logger';

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

      // 3. Buscar produtos e validar estoque
      const products = await tx.product.findMany({
        where: {
          id: { in: data.items.map(i => i.productId) }
        }
      });

      this.validateStock(products, data.items);

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

      // 10. Criar pedido
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: data.addressId,
          
          // Snapshots
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: user.phone || '',

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

          // Cupom
          couponCode: data.couponCode?.toUpperCase(),

          // Observações
          notes: data.notes,

          // Itens
          items: {
            create: data.items.map(item => {
              const product = products.find(p => p.id === item.productId)!;
              const unitPrice = Number(product.price);
              
              return {
                productId: item.productId,
                productName: product.name,
                productImage: product.images[0] || null,
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

      // 11. Decrementar estoque
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
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

      // 13. Limpar carrinho
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

      // 14. Enviar email de confirmação (não bloqueia se falhar)
      emailService
        .sendOrderConfirmation({
          userName: user.name,
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
            receiverName: address.receiverName,
            receiverPhone: address.receiverPhone,
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

      return order;
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
