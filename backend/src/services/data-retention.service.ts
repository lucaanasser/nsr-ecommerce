/**
 * Service responsável por políticas de retenção e limpeza de dados sensíveis (LGPD).
 * Implementa regras para exclusão, anonimização e notificação de dados antigos.
 */
import { prisma } from '../config/database';
import { logger } from '@config/logger.colored';
import { emailService } from './email.service';

/**
 * Serviço de Retenção de Dados (LGPD)
 * 
 * Políticas de retenção:
 * - Carrinhos abandonados: 90 dias sem atualização
 * - Logs de auditoria: 6 meses
 * - Contas inativas: 5 anos sem login
 * - Pedidos: mantidos por 5 anos (obrigação fiscal)
 * - Tokens de refresh: 30 dias expirados
 */

interface RetentionResult {
  deletedCarts: number;
  deletedRefreshTokens: number;
  deletedAuditLogs: number;
  anonymizedUsers: number;
  warningEmailsSent: number;
  deletionRequestsProcessed: number;
}

export class DataRetentionService {
  /**
   * Executa limpeza completa de dados antigos
   */
  async cleanOldData(): Promise<RetentionResult> {
    const now = new Date();
    
    logger.info('Starting data retention cleanup...');

    const result: RetentionResult = {
      deletedCarts: 0,
      deletedRefreshTokens: 0,
      deletedAuditLogs: 0,
      anonymizedUsers: 0,
      warningEmailsSent: 0,
      deletionRequestsProcessed: 0,
    };

    try {
      // 1. Deletar carrinhos abandonados (90 dias)
      result.deletedCarts = await this.cleanAbandonedCarts(now);

      // 2. Deletar refresh tokens expirados (30 dias)
      result.deletedRefreshTokens = await this.cleanExpiredRefreshTokens(now);

      // 3. Deletar logs de auditoria antigos (6 meses)
      result.deletedAuditLogs = await this.cleanOldAuditLogs(now);

      // 4. Processar solicitações de exclusão de conta
      result.deletionRequestsProcessed = await this.processDeletionRequests(now);

      // 5. Notificar usuários inativos (4 anos e 11 meses)
      result.warningEmailsSent = await this.notifyInactiveUsers(now);

      // 6. Anonimizar contas muito inativas (5 anos)
      result.anonymizedUsers = await this.anonymizeInactiveUsers(now);

      logger.info('Data retention cleanup completed', result);

      return result;
    } catch (error) {
      logger.error('Error in data retention cleanup', { error });
      throw error;
    }
  }

  /**
   * 1. Deleta carrinhos sem atualização há mais de 90 dias
   */
  private async cleanAbandonedCarts(now: Date): Promise<number> {
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    try {
      const result = await prisma.cart.deleteMany({
        where: {
          updatedAt: {
            lt: ninetyDaysAgo,
          },
        },
      });

      logger.info(`Deleted ${result.count} abandoned carts (>90 days old)`);
      return result.count;
    } catch (error) {
      logger.error('Error deleting abandoned carts', { error });
      return 0;
    }
  }

  /**
   * 2. Deleta refresh tokens expirados há mais de 30 dias
   */
  private async cleanExpiredRefreshTokens(now: Date): Promise<number> {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    try {
      const result = await prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: thirtyDaysAgo,
          },
        },
      });

      logger.info(`Deleted ${result.count} expired refresh tokens (>30 days old)`);
      return result.count;
    } catch (error) {
      logger.error('Error deleting expired refresh tokens', { error });
      return 0;
    }
  }

  /**
   * 3. Deleta logs de auditoria com mais de 6 meses
   */
  private async cleanOldAuditLogs(now: Date): Promise<number> {
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    try {
      const result = await prisma.auditLog.deleteMany({
        where: {
          createdAt: {
            lt: sixMonthsAgo,
          },
        },
      });

      logger.info(`Deleted ${result.count} old audit logs (>6 months old)`);
      return result.count;
    } catch (error) {
      logger.error('Error deleting old audit logs', { error });
      return 0;
    }
  }

  /**
   * 4. Processa solicitações de exclusão de conta (após período de carência)
   */
  private async processDeletionRequests(now: Date): Promise<number> {
    try {
      // Buscar usuários que solicitaram exclusão e o prazo já expirou
      const usersToDelete = await prisma.user.findMany({
        where: {
          deletionRequestedAt: {
            not: null,
          },
          dataRetentionDate: {
            lte: now,
          },
          anonymizedAt: null, // Ainda não foi anonimizado
        },
        include: {
          orders: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      let count = 0;

      for (const user of usersToDelete) {
        // Verificar se há pedidos pendentes
        const hasPendingOrders = user.orders.some((order) =>
          ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED'].includes(order.status)
        );

        if (hasPendingOrders) {
          logger.warn(`Cannot delete user ${user.id} - has pending orders`);
          continue;
        }

        // Anonimizar usuário
        await this.anonymizeUser(user.id);
        count++;
      }

      logger.info(`Processed ${count} deletion requests`);
      return count;
    } catch (error) {
      logger.error('Error processing deletion requests', { error });
      return 0;
    }
  }

  /**
   * 5. Notifica usuários inativos há quase 5 anos (4 anos e 11 meses)
   */
  private async notifyInactiveUsers(now: Date): Promise<number> {
    // 4 anos e 11 meses = 1795 dias
    const warningThreshold = new Date(now.getTime() - 1795 * 24 * 60 * 60 * 1000);
    // 4 anos e 10 meses = 1765 dias (para não enviar todo dia)
    const noSpamThreshold = new Date(now.getTime() - 1765 * 24 * 60 * 60 * 1000);

    try {
      const inactiveUsers = await prisma.user.findMany({
        where: {
          lastLogin: {
            lt: warningThreshold,
            gte: noSpamThreshold,
          },
          deletionRequestedAt: null,
          anonymizedAt: null,
        },
      });

      let count = 0;

      for (const user of inactiveUsers) {
        try {
          // Enviar email de aviso
          await emailService.sendInactivityWarning({
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email,
            lastLoginDate: user.lastLogin || user.createdAt,
          });

          logger.info(`Sent inactivity warning to user ${user.id}`);
          count++;
        } catch (error) {
          logger.error(`Failed to send inactivity warning to ${user.email}`, { error });
        }
      }

      logger.info(`Sent ${count} inactivity warning emails`);
      return count;
    } catch (error) {
      logger.error('Error notifying inactive users', { error });
      return 0;
    }
  }

  /**
   * 6. Anonimiza contas sem login há mais de 5 anos
   */
  private async anonymizeInactiveUsers(now: Date): Promise<number> {
    const fiveYearsAgo = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);

    try {
      const inactiveUsers = await prisma.user.findMany({
        where: {
          lastLogin: {
            lt: fiveYearsAgo,
          },
          deletionRequestedAt: null,
          anonymizedAt: null,
        },
        include: {
          orders: {
            where: {
              createdAt: {
                gte: fiveYearsAgo, // Pedidos nos últimos 5 anos
              },
            },
          },
        },
      });

      let count = 0;

      for (const user of inactiveUsers) {
        // Se teve pedidos nos últimos 5 anos, não anonimizar ainda (obrigação fiscal)
        if (user.orders.length > 0) {
          logger.info(`User ${user.id} has recent orders, skipping anonymization`);
          continue;
        }

        // Anonimizar usuário
        await this.anonymizeUser(user.id);
        count++;
      }

      logger.info(`Anonymized ${count} inactive users (>5 years)`);
      return count;
    } catch (error) {
      logger.error('Error anonymizing inactive users', { error });
      return 0;
    }
  }

  /**
   * Anonimiza um usuário (LGPD - direito ao esquecimento)
   */
  private async anonymizeUser(userId: string): Promise<void> {
    const now = new Date();

    try {
      await prisma.$transaction(async (tx) => {
        // Anonimizar dados do usuário
        await tx.user.update({
          where: { id: userId },
          data: {
            email: `deleted_${userId}@anonymized.local`,
            firstName: 'Usuário',
            lastName: 'Deletado',
            phone: null,
            cpf: null,
            anonymizedAt: now,
            // Manter campos LGPD para auditoria
          },
        });

        // Deletar endereços
        await tx.address.deleteMany({
          where: { userId },
        });

        // Deletar carrinho
        await tx.cart.deleteMany({
          where: { userId },
        });

        // Deletar refresh tokens
        await tx.refreshToken.deleteMany({
          where: { userId },
        });

        // Deletar reviews (para manter privacidade)
        await tx.review.deleteMany({
          where: { userId },
        });

        // Registrar na auditoria
        await tx.auditLog.create({
          data: {
            userId,
            action: 'USER_ANONYMIZED',
            resource: 'User',
            resourceId: userId,
            details: {
              reason: 'Inactivity or deletion request',
              anonymizedAt: now,
            },
          },
        });
      });

      logger.info(`User ${userId} anonymized successfully`);
    } catch (error) {
      logger.error(`Failed to anonymize user ${userId}`, { error });
      throw error;
    }
  }

  /**
   * Gera relatório de dados a serem limpos (sem executar)
   */
  async generateRetentionReport(): Promise<{
    abandonedCarts: number;
    expiredTokens: number;
    oldAuditLogs: number;
    pendingDeletions: number;
    inactiveUsersWarning: number;
    inactiveUsersAnonymize: number;
  }> {
    const now = new Date();

    const [
      abandonedCarts,
      expiredTokens,
      oldAuditLogs,
      pendingDeletions,
      inactiveUsersWarning,
      inactiveUsersAnonymize,
    ] = await Promise.all([
      // Carrinhos > 90 dias
      prisma.cart.count({
        where: {
          updatedAt: {
            lt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Tokens expirados > 30 dias
      prisma.refreshToken.count({
        where: {
          expiresAt: {
            lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Logs > 6 meses
      prisma.auditLog.count({
        where: {
          createdAt: {
            lt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Solicitações de exclusão pendentes
      prisma.user.count({
        where: {
          deletionRequestedAt: { not: null },
          dataRetentionDate: { lte: now },
          anonymizedAt: null,
        },
      }),
      // Usuários inativos 4 anos e 11 meses
      prisma.user.count({
        where: {
          lastLogin: {
            lt: new Date(now.getTime() - 1795 * 24 * 60 * 60 * 1000),
          },
          deletionRequestedAt: null,
          anonymizedAt: null,
        },
      }),
      // Usuários inativos > 5 anos
      prisma.user.count({
        where: {
          lastLogin: {
            lt: new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000),
          },
          deletionRequestedAt: null,
          anonymizedAt: null,
        },
      }),
    ]);

    return {
      abandonedCarts,
      expiredTokens,
      oldAuditLogs,
      pendingDeletions,
      inactiveUsersWarning,
      inactiveUsersAnonymize,
    };
  }
}

export const dataRetentionService = new DataRetentionService();
