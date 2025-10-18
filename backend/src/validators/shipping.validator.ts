import { z } from 'zod';

export const calculateShippingSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1)
    })
  ).min(1),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/),
  cartTotal: z.number().min(0)
});
