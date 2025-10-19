import { Request, Response } from 'express';
import { dataRetentionService } from '../../services/data-retention.service';
import { dataRetentionScheduler } from '../../services/data-retention.scheduler';
import { logger } from '@config/logger.colored';

/**
 * Controller Admin - LGPD Data Retention
 * Apenas para administradores
 */

/**
 * Gera relatório de dados a serem limpos (preview)
 */
export async function getRetentionReport(_req: Request, res: Response) {
  try {
    const report = await dataRetentionService.generateRetentionReport();
    
    res.json({
      success: true,
      message: 'Relatório de retenção de dados gerado',
      data: {
        summary: {
          total: (Object.values(report) as number[]).reduce((a, b) => a + b, 0),
        },
        details: {
          abandonedCarts: {
            count: report.abandonedCarts,
            description: 'Carrinhos sem atualização há mais de 90 dias',
          },
          expiredTokens: {
            count: report.expiredTokens,
            description: 'Refresh tokens expirados há mais de 30 dias',
          },
          oldAuditLogs: {
            count: report.oldAuditLogs,
            description: 'Logs de auditoria com mais de 6 meses',
          },
          pendingDeletions: {
            count: report.pendingDeletions,
            description: 'Solicitações de exclusão pendentes',
          },
          inactiveUsersWarning: {
            count: report.inactiveUsersWarning,
            description: 'Usuários inativos há ~5 anos (receberão aviso)',
          },
          inactiveUsersAnonymize: {
            count: report.inactiveUsersAnonymize,
            description: 'Usuários inativos há mais de 5 anos (serão anonimizados)',
          },
        },
      },
    });
  } catch (error) {
    logger.error('Error generating retention report', { error });
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório de retenção',
    });
  }
}

/**
 * Executa limpeza de dados manualmente
 */
export async function runDataCleanup(req: Request, res: Response) {
  try {
    logger.info('Manual data cleanup requested by admin', {
      adminId: req.user?.userId,
      adminEmail: req.user?.email,
    });

    const result = await dataRetentionService.cleanOldData();
    
    res.json({
      success: true,
      message: 'Limpeza de dados executada com sucesso',
      data: {
        deletedCarts: result.deletedCarts,
        deletedRefreshTokens: result.deletedRefreshTokens,
        deletedAuditLogs: result.deletedAuditLogs,
        anonymizedUsers: result.anonymizedUsers,
        warningEmailsSent: result.warningEmailsSent,
        deletionRequestsProcessed: result.deletionRequestsProcessed,
      },
    });
  } catch (error) {
    logger.error('Error running data cleanup', { error });
    res.status(500).json({
      success: false,
      message: 'Erro ao executar limpeza de dados',
    });
  }
}

/**
 * Status do scheduler de retenção
 */
export async function getSchedulerStatus(_req: Request, res: Response) {
  try {
    const isRunning = dataRetentionScheduler.isRunning();
    
    res.json({
      success: true,
      data: {
        isRunning,
        schedule: 'Daily at 3:00 AM',
        description: 'Automatic data retention cleanup',
      },
    });
  } catch (error) {
    logger.error('Error getting scheduler status', { error });
    res.status(500).json({
      success: false,
      message: 'Erro ao obter status do scheduler',
    });
  }
}
