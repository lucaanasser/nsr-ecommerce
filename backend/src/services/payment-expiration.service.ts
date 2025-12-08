import * as cron from 'node-cron';
import { prisma } from '../config/database';
import { logger } from '../config/logger.colored';
import { inventoryService } from './inventory.service';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

/**
 * Payment Expiration Service
 * Handles automatic expiration of PIX payments and order cancellations
 */
export class PaymentExpirationService {
  private pixExpirationJob: cron.ScheduledTask | null = null;
  private orderExpirationJob: cron.ScheduledTask | null = null;

  /**
   * Start all cron jobs
   */
  start() {
    this.startPixExpirationJob();
    this.startOrderExpirationJob();
    logger.info('Payment expiration cron jobs started');
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    if (this.pixExpirationJob) {
      this.pixExpirationJob.stop();
      this.pixExpirationJob = null;
    }
    if (this.orderExpirationJob) {
      this.orderExpirationJob.stop();
      this.orderExpirationJob = null;
    }
    logger.info('Payment expiration cron jobs stopped');
  }

  /**
   * Check and expire PIX payments every 5 minutes
   * PIX payments are reserved for 15 minutes
   */
  private startPixExpirationJob() {
    // Run every 5 minutes
    this.pixExpirationJob = cron.schedule('*/5 * * * *', async () => {
      try {
        await this.expirePixPayments();
      } catch (error) {
        logger.error('Error in PIX expiration job', { error });
      }
    });
  }

  /**
   * Check and cancel orders after 24h without payment every hour
   */
  private startOrderExpirationJob() {
    // Run every hour
    this.orderExpirationJob = cron.schedule('0 * * * *', async () => {
      try {
        await this.expireOrders();
      } catch (error) {
        logger.error('Error in order expiration job', { error });
      }
    });
  }

  /**
   * Expire PIX payments that have exceeded the 15-minute reservation window
   */
  private async expirePixPayments() {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    logger.info('Checking for expired PIX payments', {
      cutoffTime: fifteenMinutesAgo.toISOString(),
    });

    // Find PIX payments that are waiting/pending and older than 15 minutes
    const expiredPayments = await prisma.payment.findMany({
      where: {
        method: PaymentMethod.PIX,
        status: {
          in: [PaymentStatus.PENDING, PaymentStatus.WAITING],
        },
        createdAt: {
          lt: fifteenMinutesAgo,
        },
        stockReserved: true,
      },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (expiredPayments.length === 0) {
      logger.info('No expired PIX payments found');
      return;
    }

    logger.info('Found expired PIX payments', {
      count: expiredPayments.length,
    });

    for (const payment of expiredPayments) {
      try {
        // Release stock reservation
        await inventoryService.releaseStock(payment.orderId);

        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.EXPIRED,
            stockReserved: false,
            metadata: {
              ...(payment.metadata as object),
              expiredAt: new Date().toISOString(),
              expiredReason: 'PIX_15_MINUTE_TIMEOUT',
            },
          },
        });

        logger.info('PIX payment expired and stock released', {
          paymentId: payment.id,
          orderId: payment.orderId,
          chargeId: payment.chargeId,
        });
      } catch (error) {
        logger.error('Failed to expire PIX payment', {
          paymentId: payment.id,
          orderId: payment.orderId,
          error,
        });
      }
    }

    logger.info('PIX expiration job completed', {
      processed: expiredPayments.length,
    });
  }

  /**
   * Cancel orders that haven't been paid within 24 hours
   */
  private async expireOrders() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    logger.info('Checking for expired orders', {
      cutoffTime: twentyFourHoursAgo.toISOString(),
    });

    // Find orders that are still pending after 24h
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        firstPaymentAttemptAt: {
          lt: twentyFourHoursAgo,
        },
      },
      include: {
        payments: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (expiredOrders.length === 0) {
      logger.info('No expired orders found');
      return;
    }

    logger.info('Found expired orders', {
      count: expiredOrders.length,
    });

    for (const order of expiredOrders) {
      try {
        // Release any remaining stock reservations
        const activeReservations = order.payments.filter(
          (p) =>
            p.method === PaymentMethod.PIX &&
            p.stockReserved &&
            p.status !== PaymentStatus.PAID
        );

        for (const payment of activeReservations) {
          await inventoryService.releaseStock(order.id);
          
          await prisma.payment.update({
            where: { id: payment.id },
            data: { stockReserved: false },
          });
        }

        // Cancel order
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CANCELED',
          },
        });

        logger.info('Order canceled after 24h without payment', {
          orderId: order.id,
          totalPaymentAttempts: order.payments.length,
        });
      } catch (error) {
        logger.error('Failed to expire order', {
          orderId: order.id,
          error,
        });
      }
    }

    logger.info('Order expiration job completed', {
      processed: expiredOrders.length,
    });
  }

  /**
   * Manually trigger PIX expiration check (for testing)
   */
  async manualPixExpiration() {
    logger.info('Manual PIX expiration triggered');
    await this.expirePixPayments();
  }

  /**
   * Manually trigger order expiration check (for testing)
   */
  async manualOrderExpiration() {
    logger.info('Manual order expiration triggered');
    await this.expireOrders();
  }
}

export const paymentExpirationService = new PaymentExpirationService();
