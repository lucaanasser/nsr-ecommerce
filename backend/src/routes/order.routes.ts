/**
 * Rotas responsáveis por operações de pedidos do usuário autenticado.
 * Inclui endpoints para criar, listar, buscar e cancelar pedidos.
 */
import { Router } from 'express';
import * as orderController from '@controllers/order.controller';
import { authenticate } from '@middlewares/authenticate';
import { validate } from '@middlewares/validate';
import { createOrderSchema, cancelOrderSchema } from '@validators/order.validator';
import { retryPaymentSchema } from '@validators/payment.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.get('/:id/payment-status', orderController.getPaymentStatus);
router.post('/:id/retry-payment', validate(retryPaymentSchema), orderController.retryPayment);
router.post('/:id/cancel', validate(cancelOrderSchema), orderController.cancelOrder);

export default router;
