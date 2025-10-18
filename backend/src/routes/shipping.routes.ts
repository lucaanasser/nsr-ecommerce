import { Router } from 'express';
import * as shippingController from '@controllers/shipping.controller';
import { validate } from '@middlewares/validate';
import { calculateShippingSchema } from '@validators/shipping.validator';

const router = Router();

router.post('/calculate', validate(calculateShippingSchema), shippingController.calculateShipping);
router.get('/methods', shippingController.getShippingMethods);

export default router;
