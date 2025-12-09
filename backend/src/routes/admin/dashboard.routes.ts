import { Router } from 'express';
import * as dashboardController from '../../controllers/admin/dashboard.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

router.use(authenticate as any);
router.use(authorize('ADMIN') as any);

router.get('/stats', dashboardController.getStats);

export default router;
