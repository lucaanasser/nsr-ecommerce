import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger.colored';
import { inventoryService } from '../services/inventory.service';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

/**
 * Webhook Controller
 * Handles payment notifications from PagBank
 */
export class WebhookController {
  /**
   * Handle PagBank webhook notification
   */
  async handlePagBankWebhook(req: Request, res: Response) {
    try {
      const webhookData = req.body;
      
      logger.info('Received PagBank webhook', {
        eventId: webhookData.id,
        referenceId: webhookData.reference_id,
        hasCharges: !!webhookData.charges,
        chargesCount: webhookData.charges?.length || 0,
      });

      // Log full webhook data for debugging
      logger.info('Full webhook payload', {
        payload: JSON.stringify(webhookData, null, 2),
      });

      // Store webhook event for audit
      await prisma.webhookEvent.create({
        data: {
          provider: 'PAGBANK',
          eventType: 'CHARGE_STATUS_UPDATE',
          payload: webhookData,
        },
      });

      // Extract charge information
      const charges = webhookData.charges || [];
      
      for (const charge of charges) {
        const chargeId = charge.id;
        const newStatus = charge.status;
        
        logger.info('Processing charge status update', {
          chargeId,
          newStatus,
          referenceId: charge.reference_id,
        });

        // Find payment by chargeId
        const payment = await prisma.payment.findFirst({
          where: { chargeId },
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

        if (!payment) {
          logger.warn('Payment not found for charge', { chargeId });
          continue;
        }

        // Skip if already processed to this status
        if (payment.status === this.mapPagBankStatus(newStatus)) {
          logger.info('Payment already in this status', {
            paymentId: payment.id,
            status: payment.status,
          });
          continue;
        }

        // Update payment status
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: this.mapPagBankStatus(newStatus),
            metadata: {
              ...(payment.metadata as object),
              lastWebhookUpdate: new Date().toISOString(),
              lastWebhookStatus: newStatus,
            },
          },
        });

        logger.info('Payment status updated', {
          paymentId: payment.id,
          oldStatus: payment.status,
          newStatus: updatedPayment.status,
        });

        // Handle status-specific logic
        await this.handlePaymentStatusChange(
          payment,
          updatedPayment.status
        );
      }

      // Acknowledge webhook
      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Error processing PagBank webhook', { error });
      
      // Still return 200 to avoid PagBank retries for processing errors
      // The webhook event is already stored, we can reprocess manually if needed
      res.status(200).json({ received: true, error: 'Processing error' });
    }
  }

  /**
   * Handle payment status change side effects
   */
  private async handlePaymentStatusChange(
    payment: any,
    newStatus: PaymentStatus
  ) {
    try {
      switch (newStatus) {
        case PaymentStatus.PAID:
          await this.handlePaymentApproved(payment);
          break;

        case PaymentStatus.CANCELED:
        case PaymentStatus.DECLINED:
          await this.handlePaymentFailed(payment);
          break;

        case PaymentStatus.EXPIRED:
          await this.handlePaymentExpired(payment);
          break;

        default:
          logger.info('No specific action for payment status', {
            paymentId: payment.id,
            status: newStatus,
          });
      }
    } catch (error) {
      logger.error('Error handling payment status change', {
        paymentId: payment.id,
        newStatus,
        error,
      });
    }
  }

  /**
   * Handle approved payment
   */
  private async handlePaymentApproved(payment: any) {
    logger.info('Processing approved payment', {
      paymentId: payment.id,
      orderId: payment.orderId,
      method: payment.method,
    });

    // Update order status to CONFIRMED
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'CONFIRMED',
      },
    });

    // Handle stock based on payment method
    if (payment.method === PaymentMethod.PIX) {
      // PIX: Stock was reserved, no action needed (it's already decremented)
      logger.info('PIX payment approved - stock already reserved', {
        paymentId: payment.id,
        orderId: payment.orderId,
      });
        } else if (payment.method === PaymentMethod.CREDIT_CARD) {
      // Credit card: Decrement stock if not already done
      if (!payment.stockReserved) {
        await inventoryService.reserveStock(payment.orderId, payment.order.items);        await prisma.payment.update({
          where: { id: payment.id },
          data: { stockReserved: true },
        });

        logger.info('Stock decremented for approved credit card payment', {
          paymentId: payment.id,
          orderId: payment.orderId,
        });
      }
    }

    // TODO: Send order confirmation email
    logger.info('Order confirmed via webhook', {
      orderId: payment.orderId,
      paymentId: payment.id,
    });
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(payment: any) {
    logger.info('Processing failed payment', {
      paymentId: payment.id,
      orderId: payment.orderId,
      method: payment.method,
    });

    // Release PIX stock reservation if applicable
    if (payment.method === PaymentMethod.PIX && payment.stockReserved) {
      await inventoryService.releaseStock(payment.orderId);
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: { stockReserved: false },
      });

      logger.info('PIX stock reservation released after failure', {
        paymentId: payment.id,
        orderId: payment.orderId,
      });
    }

    // Check if order should be canceled (after 24h or max attempts)
    const order = payment.order;
    const firstAttempt = new Date(order.firstPaymentAttemptAt);
    const hoursSinceFirstAttempt =
      (Date.now() - firstAttempt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceFirstAttempt > 24) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELED' },
      });

      logger.info('Order canceled - 24h payment window expired', {
        orderId: order.id,
      });
    }
  }

  /**
   * Handle expired payment (PIX timeout)
   */
  private async handlePaymentExpired(payment: any) {
    logger.info('Processing expired payment', {
      paymentId: payment.id,
      orderId: payment.orderId,
      method: payment.method,
    });

    // Release PIX stock reservation
    if (payment.method === PaymentMethod.PIX && payment.stockReserved) {
      await inventoryService.releaseStock(payment.orderId);
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: { stockReserved: false },
      });

      logger.info('PIX stock reservation released after expiration', {
        paymentId: payment.id,
        orderId: payment.orderId,
      });
    }

    // Order remains PENDING - user can retry payment
    logger.info('Payment expired - order remains pending for retry', {
      orderId: payment.orderId,
    });
  }

  /**
   * Map PagBank status to internal PaymentStatus enum
   */
  private mapPagBankStatus(pagbankStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      PAID: PaymentStatus.PAID,
      DECLINED: PaymentStatus.DECLINED,
      CANCELED: PaymentStatus.CANCELED,
      AUTHORIZED: PaymentStatus.AUTHORIZED,
      IN_ANALYSIS: PaymentStatus.IN_ANALYSIS,
      WAITING: PaymentStatus.WAITING,
    };

    return statusMap[pagbankStatus] || PaymentStatus.PENDING;
  }
}

export const webhookController = new WebhookController();
