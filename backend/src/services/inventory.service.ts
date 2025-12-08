/**
 * Serviço de gerenciamento de inventário (estoque)
 * Responsável por reservar e liberar estoque, especialmente para PIX
 */
import { prisma } from '@config/database';
import { logger } from '@config/logger.colored';

interface StockItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface StockValidationResult {
  available: boolean;
  unavailableItems: Array<{
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
}

class InventoryService {
  /**
   * Valida se há estoque disponível para os itens (sem reservar)
   * Usado para cartão de crédito e antes de criar pedidos
   */
  async validateStockAvailability(items: StockItem[]): Promise<StockValidationResult> {
    const unavailableItems: StockValidationResult['unavailableItems'] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, name: true },
      });

      if (!product) {
        unavailableItems.push({
          productId: item.productId,
          requestedQuantity: item.quantity,
          availableQuantity: 0,
        });
        continue;
      }

      if (product.stock < item.quantity) {
        unavailableItems.push({
          productId: item.productId,
          requestedQuantity: item.quantity,
          availableQuantity: product.stock,
        });
      }
    }

    return {
      available: unavailableItems.length === 0,
      unavailableItems,
    };
  }

  /**
   * Reserva estoque para um pedido PIX
   * Decrementa o estoque dos produtos
   */
  async reserveStockForPix(orderId: string, items: StockItem[]): Promise<void> {
    logger.info('Reserving stock for PIX order', { orderId, itemCount: items.length });

    try {
      await prisma.$transaction(async (tx) => {
        for (const item of items) {
          // Verificar se há estoque disponível
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true, name: true },
          });

          if (!product) {
            throw new Error(`Produto ${item.productId} não encontrado`);
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}, Solicitado: ${item.quantity}`
            );
          }

          // Decrementar estoque
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          logger.info('Stock reserved', {
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            newStock: product.stock - item.quantity,
          });
        }

        // Marcar que o estoque foi reservado no Payment
        await tx.payment.updateMany({
          where: {
            orderId,
            method: 'PIX',
          },
          data: {
            stockReserved: true,
          },
        });
      });

      logger.info('Stock reservation completed', { orderId });
    } catch (error) {
      logger.error('Failed to reserve stock', { orderId, error });
      throw error;
    }
  }

  /**
   * Libera estoque de um pedido PIX expirado ou cancelado
   * Incrementa o estoque de volta
   */
  async releasePixStock(orderId: string): Promise<void> {
    logger.info('Releasing PIX stock', { orderId });

    try {
      await prisma.$transaction(async (tx) => {
        // Buscar o pedido com os itens
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            items: true,
            payments: {
              where: {
                method: 'PIX',
                stockReserved: true,
              },
            },
          },
        });

        if (!order) {
          logger.warn('Order not found for stock release', { orderId });
          return;
        }

        // Verificar se há estoque reservado
        if (order.payments.length === 0) {
          logger.info('No reserved stock to release', { orderId });
          return;
        }

        // Incrementar estoque de volta
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });

          logger.info('Stock released', {
            orderId,
            productId: item.productId,
            quantity: item.quantity,
          });
        }

        // Marcar que o estoque foi liberado
        await tx.payment.updateMany({
          where: {
            orderId,
            method: 'PIX',
            stockReserved: true,
          },
          data: {
            stockReserved: false,
          },
        });
      });

      logger.info('Stock release completed', { orderId });
    } catch (error) {
      logger.error('Failed to release stock', { orderId, error });
      throw error;
    }
  }

  /**
   * Confirma a reserva de estoque (não precisa fazer nada, apenas log)
   * Chamado quando o pagamento é aprovado
   */
  async confirmReservation(orderId: string): Promise<void> {
    logger.info('Stock reservation confirmed (payment approved)', { orderId });
    // Não precisa fazer nada, o estoque já foi decrementado na reserva
  }

  /**
   * Decrementa estoque para pedidos com cartão (sem reserva prévia)
   * Chamado após aprovação do pagamento
   */
  async decrementStockForOrder(orderId: string, items: StockItem[]): Promise<void> {
    logger.info('Decrementing stock for approved order', { orderId });

    try {
      await prisma.$transaction(async (tx) => {
        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true, name: true },
          });

          if (!product) {
            throw new Error(`Produto ${item.productId} não encontrado`);
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}, Solicitado: ${item.quantity}`
            );
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          logger.info('Stock decremented', {
            orderId,
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      });

      logger.info('Stock decrement completed', { orderId });
    } catch (error) {
      logger.error('Failed to decrement stock', { orderId, error });
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();
