import { prisma } from '@config/database';
import { PaymentStatus } from '@prisma/client';

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Total Revenue (Paid orders)
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PAID }
    });

    // 2. Monthly Revenue
    const monthlyRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.PAID,
        createdAt: { gte: startOfMonth }
      }
    });

    // 3. Last Month Revenue (for growth calculation)
    const lastMonthRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.PAID,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    });

    // 4. Total Orders
    const totalOrders = await prisma.order.count();

    // 5. Monthly Orders
    const monthlyOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfMonth } }
    });

    // 6. Average Ticket (Total Revenue / Total Paid Orders)
    const paidOrdersCount = await prisma.order.count({
      where: { paymentStatus: 'PAID' }
    });

    const averageTicket = paidOrdersCount > 0 
      ? (Number(totalRevenue._sum.amount || 0) / paidOrdersCount) 
      : 0;

    // 7. Recent Orders (Last 5)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Calculate growth
    const currentMonthValue = Number(monthlyRevenue._sum.amount || 0);
    const lastMonthValue = Number(lastMonthRevenue._sum.amount || 0);
    
    let growthRate = 0;
    if (lastMonthValue > 0) {
      growthRate = ((currentMonthValue - lastMonthValue) / lastMonthValue) * 100;
    } else if (currentMonthValue > 0) {
      growthRate = 100;
    }

    return {
      revenue: {
        total: Number(totalRevenue._sum.amount || 0),
        monthly: currentMonthValue,
        growth: growthRate
      },
      orders: {
        total: totalOrders,
        monthly: monthlyOrders
      },
      averageTicket,
      recentOrders
    };
  }
}
