import { Router } from 'express';
import * as adminOrderController from '../../controllers/admin/order.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

router.use(authenticate as any);
router.use(authorize('ADMIN') as any);

router.get('/', adminOrderController.getOrders);
router.patch('/:id/status', adminOrderController.updateOrderStatus);

export default router;
