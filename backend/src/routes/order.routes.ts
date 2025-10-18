import { Router } from 'express';
import * as orderController from '@controllers/order.controller';
import { authenticate } from '@middlewares/authenticate';
import { validate } from '@middlewares/validate';
import { createOrderSchema, cancelOrderSchema } from '@validators/order.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/:id/cancel', validate(cancelOrderSchema), orderController.cancelOrder);

export default router;
