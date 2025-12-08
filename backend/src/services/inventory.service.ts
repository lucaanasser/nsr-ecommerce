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
   * Reserva estoque para um pedido (PIX ou Cartão)
   * Decrementa o estoque dos produtos
   */
  async reserveStock(
    orderId: string, 
    items: StockItem[], 
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    logger.info('Reserving stock for order', { orderId, itemCount: items.length });
    
    const db = tx || prisma;

    try {
      // Se já estiver em transação (tx fornecido), usa ela. Senão, cria uma nova.
      const operation = async (transaction: Prisma.TransactionClient) => {
        for (const item of items) {
          // Verificar se há estoque disponível
          const product = await transaction.product.findUnique({
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
          await transaction.product.update({
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
        // Nota: O Payment deve existir antes de chamar este método
        await transaction.payment.updateMany({
          where: {
            orderId,
          },
          data: {
            stockReserved: true,
          },
        });
      };

      if (tx) {
        await operation(tx);
      } else {
        await prisma.$transaction(operation);
      }

      logger.info('Stock reservation completed', { orderId });
    } catch (error) {
      logger.error('Failed to reserve stock', { orderId, error });
      throw error;
    }
  }

  /**
   * Libera estoque de um pedido expirado, cancelado ou falho
   * Incrementa o estoque de volta
   */
  async releaseStock(orderId: string, tx?: Prisma.TransactionClient): Promise<void> {
    logger.info('Releasing stock', { orderId });
    
    const db = tx || prisma;

    try {
      const operation = async (transaction: Prisma.TransactionClient) => {
        // Buscar o pedido com os itens
        const order = await transaction.order.findUnique({
          where: { id: orderId },
          include: {
            items: true,
            payments: {
              where: {
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
          await transaction.product.update({
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
        await transaction.payment.updateMany({
          where: {
            orderId,
            stockReserved: true,
          },
          data: {
            stockReserved: false,
          },
        });
      };

      if (tx) {
        await operation(tx);
      } else {
        await prisma.$transaction(operation);
      }

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
  async decrementStockForOrder(orderId: string, items: StockItem[], tx?: Prisma.TransactionClient): Promise<void> {
    return this.reserveStock(orderId, items, tx);
  }
}

export const inventoryService = new InventoryService();
