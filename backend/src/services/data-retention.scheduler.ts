import * as cron from 'node-cron';
import { dataRetentionService } from '../services/data-retention.service';
import { logger } from '../config/logger';

/**
 * Agendador de tarefas LGPD
 * Executa limpeza de dados automaticamente
 */
export class DataRetentionScheduler {
  private task: cron.ScheduledTask | null = null;

  /**
   * Inicia o cron job de retenção de dados
   * Executado diariamente às 3h da manhã
   */
  start(): void {
    if (this.task) {
      logger.warn('Data retention scheduler already running');
      return;
    }

    // Executar todo dia às 3:00 AM
    this.task = cron.schedule('0 3 * * *', async () => {
      logger.info('Starting scheduled data retention cleanup...');
      
      try {
        const result = await dataRetentionService.cleanOldData();
        
        logger.info('Scheduled data retention cleanup completed', result);
        
        // Se houver muitos dados deletados, registrar alerta
        if (result.anonymizedUsers > 0) {
          logger.warn(`${result.anonymizedUsers} users were anonymized due to inactivity`);
        }
      } catch (error) {
        logger.error('Scheduled data retention cleanup failed', { error });
      }
    });

    logger.info('Data retention scheduler started (daily at 3:00 AM)');
  }

  /**
   * Para o cron job
   */
  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      logger.info('Data retention scheduler stopped');
    }
  }

  /**
   * Verifica se o scheduler está rodando
   */
  isRunning(): boolean {
    return this.task !== null;
  }

  /**
   * Executa limpeza manualmente (para testes ou admin)
   */
  async runNow(): Promise<void> {
    logger.info('Running data retention cleanup manually...');
    
    try {
      const result = await dataRetentionService.cleanOldData();
      logger.info('Manual data retention cleanup completed', result);
    } catch (error) {
      logger.error('Manual data retention cleanup failed', { error });
      throw error;
    }
  }
}

export const dataRetentionScheduler = new DataRetentionScheduler();
