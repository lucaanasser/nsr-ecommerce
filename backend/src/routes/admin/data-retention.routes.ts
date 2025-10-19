/**
 * Rotas administrativas para políticas de retenção e limpeza de dados (LGPD).
 * Permite geração de relatórios, execução manual e status do scheduler de limpeza.
 * Acesso restrito a usuários ADMIN.
 */
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import * as dataRetentionController from '../../controllers/admin/data-retention.controller';

const router = Router();

/**
 * Todas as rotas requerem autenticação e role ADMIN
 */
router.use(authenticate);
router.use(authorize('ADMIN') as any);

/**
 * GET /api/v1/admin/data-retention/report
 * Gera relatório de dados a serem limpos (preview)
 */
router.get('/report', dataRetentionController.getRetentionReport);

/**
 * POST /api/v1/admin/data-retention/cleanup
 * Executa limpeza de dados manualmente
 */
router.post('/cleanup', dataRetentionController.runDataCleanup);

/**
 * GET /api/v1/admin/data-retention/scheduler/status
 * Status do scheduler automático
 */
router.get('/scheduler/status', dataRetentionController.getSchedulerStatus);

export default router;
