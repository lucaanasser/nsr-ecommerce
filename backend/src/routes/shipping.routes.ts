/**
 * Rotas responsáveis por cálculo e listagem de métodos de frete.
 * Define endpoints para cálculo de frete e métodos disponíveis.
 */
import { Router } from 'express';
import * as shippingController from '@controllers/shipping.controller';
import { validate } from '@middlewares/validate';
import { calculateShippingSchema } from '@validators/shipping.validator';

const router = Router();

router.post('/calculate', validate(calculateShippingSchema), shippingController.calculateShipping);
router.get('/methods', shippingController.getShippingMethods);

export default router;
