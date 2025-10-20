/**
 * Repositório responsável por todas as operações de banco de dados relacionadas a pedidos.
 * Implementa métodos customizados para busca, listagem e detalhes de pedidos.
 */
import { Prisma, OrderStatus, PaymentStatus } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { prisma } from '../config/database';

type Order = Prisma.OrderGetPayload<{}>;

/**
 * Order Repository
 * Gerencia todas as operações de banco de dados relacionadas a pedidos
 */
export class OrderRepository extends BaseRepository<Order> {
  protected model = prisma.order;

  /**
   * Encontra pedido por número de pedido
   */
  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.model.findUnique({
      where: { orderNumber },
    });
  }

  /**
   * Encontra pedidos por userId
   */
  async findByUserId(userId: string, options?: {
    take?: number;
    skip?: number;
    status?: OrderStatus;
  }) {
    const where: Prisma.OrderWhereInput = { userId };

    if (options?.status) {
      where.status = options.status;
    }

    return this.model.findMany({
      where,
      take: options?.take,
      skip: options?.skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Encontra pedido com itens
   */
  async findWithItems(orderId: string) {
    return this.model.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  /**
   * Encontra pedido por número com detalhes completos
   */
  async findByOrderNumberWithDetails(orderNumber: string) {
    return this.model.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  /**
   * Atualiza status do pedido
   */
  async updateStatus(
    orderId: string,
    status: OrderStatus,
    additionalData?: Partial<Order>
  ): Promise<Order> {
    const data: any = { status };

    // Atualiza timestamps específicos baseado no status
    switch (status) {
      case 'SHIPPED':
        data.shippedAt = new Date();
        break;
      case 'DELIVERED':
        data.deliveredAt = new Date();
        break;
      case 'CANCELLED':
        data.cancelledAt = new Date();
        break;
    }

    // Mescla dados adicionais
    Object.assign(data, additionalData);

    return this.model.update({
      where: { id: orderId },
      data,
    });
  }

  /**
   * Atualiza status de pagamento
   */
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentId?: string
  ): Promise<Order> {
    const data: any = { paymentStatus };

    if (paymentStatus === 'APPROVED') {
      data.paidAt = new Date();
      data.status = 'PAID'; // Atualiza status do pedido também
    }

    if (paymentId) {
      data.paymentId = paymentId;
    }

    return this.model.update({
      where: { id: orderId },
      data,
    });
  }

  /**
   * Adiciona tracking code ao pedido
   */
  async addTrackingCode(
    orderId: string,
    trackingCode: string
  ): Promise<Order> {
    return this.model.update({
      where: { id: orderId },
      data: {
        trackingCode,
        status: 'SHIPPED',
        shippedAt: new Date(),
      },
    });
  }

  /**
   * Cancela pedido
   */
  async cancelOrder(
    orderId: string,
    cancelReason: string
  ): Promise<Order> {
    return this.model.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason,
      },
    });
  }

  /**
   * Gera próximo número de pedido
   */
  async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    
    // Conta pedidos do ano atual
    const count = await this.model.count({
      where: {
        orderNumber: {
          startsWith: `NSR-${year}`,
        },
      },
    });

    // Formato: NSR-2025-0001
    const orderNumber = `NSR-${year}-${String(count + 1).padStart(4, '0')}`;
    return orderNumber;
  }

  /**
   * Lista todos os pedidos (admin)
   */
  async findAllOrders(options?: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    take?: number;
    skip?: number;
  }) {
    const where: Prisma.OrderWhereInput = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.paymentStatus) {
      where.paymentStatus = options.paymentStatus;
    }

    if (options?.search) {
      where.OR = [
        { orderNumber: { contains: options.search, mode: 'insensitive' } },
        { customerName: { contains: options.search, mode: 'insensitive' } },
        { customerEmail: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt.gte = options.startDate;
      }
      if (options.endDate) {
        where.createdAt.lte = options.endDate;
      }
    }

    return this.model.findMany({
      where,
      take: options?.take,
      skip: options?.skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Calcula estatísticas de pedidos
   */
  async getStats(period?: { startDate: Date; endDate: Date }) {
    const where: Prisma.OrderWhereInput = {};

    if (period) {
      where.createdAt = {
        gte: period.startDate,
        lte: period.endDate,
      };
    }

    const [
      total,
      pending,
      paid,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
    ] = await Promise.all([
      this.model.count({ where }),
      this.model.count({ where: { ...where, status: 'PENDING' } }),
      this.model.count({ where: { ...where, status: 'PAID' } }),
      this.model.count({ where: { ...where, status: 'PROCESSING' } }),
      this.model.count({ where: { ...where, status: 'SHIPPED' } }),
      this.model.count({ where: { ...where, status: 'DELIVERED' } }),
      this.model.count({ where: { ...where, status: 'CANCELLED' } }),
      this.model.aggregate({
        where: {
          ...where,
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    return {
      total,
      pending,
      paid,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue: Number(totalRevenue._sum.total || 0),
    };
  }

  /**
   * Encontra pedidos pendentes de pagamento há mais de X horas
   */
  async findPendingPaymentOrders(hoursAgo: number) {
    const dateThreshold = new Date();
    dateThreshold.setHours(dateThreshold.getHours() - hoursAgo);

    return this.model.findMany({
      where: {
        status: 'PENDING',
        paymentStatus: 'PENDING',
        createdAt: {
          lte: dateThreshold,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}

// Exporta instância única (Singleton)
export const orderRepository = new OrderRepository();
