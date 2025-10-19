/**
 * Schemas de validação (Zod) para criação e cancelamento de pedidos.
 * Garante integridade dos dados enviados para endpoints de pedidos.
 */
import { z } from 'zod';

export const createOrderSchema = z.object({
  addressId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1),
      size: z.string().optional(),
      color: z.string().optional()
    })
  ).min(1),
  shippingMethodId: z.string().uuid(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['credit_card', 'pix', 'boleto']),
  notes: z.string().max(500).optional()
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(10).max(500)
});
