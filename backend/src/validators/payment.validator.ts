import { z } from 'zod';

/**
 * Validator for encrypted credit card data
 */
export const creditCardSchema = z.object({
  encrypted: z.string().min(1, 'Encrypted card data is required'),
  holderName: z.string().min(1, 'Card holder name is required'),
  holderCpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF must contain exactly 11 digits')
    .refine(
      (cpf) => {
        // Basic CPF validation (check if all digits are the same)
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Validate first check digit
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(9))) return false;
        
        // Validate second check digit
        sum = 0;
        for (let i = 0; i < 10; i++) {
          sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(10))) return false;
        
        return true;
      },
      { message: 'Invalid CPF' }
    ),
});

/**
 * Validator for payment method in order creation
 */
export const paymentMethodSchema = z.enum(['credit_card', 'pix'], {
  errorMap: () => ({ message: 'Payment method must be credit_card or pix' }),
});

/**
 * Validator for retry payment request
 */
export const retryPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  paymentMethod: paymentMethodSchema,
  creditCard: creditCardSchema.optional(),
}).refine(
  (data) => {
    // Credit card data is required when payment method is credit_card
    if (data.paymentMethod === 'credit_card') {
      return !!data.creditCard;
    }
    return true;
  },
  {
    message: 'Credit card data is required for credit card payments',
    path: ['creditCard'],
  }
);

/**
 * Validator for webhook signature verification
 */
export const webhookSignatureSchema = z.object({
  signature: z.string().min(1, 'Webhook signature is required'),
  timestamp: z.string().min(1, 'Webhook timestamp is required'),
});

/**
 * Validator for PagBank webhook payload
 */
export const pagbankWebhookSchema = z.object({
  body: z.object({
    id: z.string().min(1, 'Event ID is required'),
    reference_id: z.string().optional(),
    charges: z
      .array(
        z.object({
          id: z.string(),
          reference_id: z.string().optional(),
          status: z.string(),
          created_at: z.string(),
          paid_at: z.string().optional(),
          amount: z.object({
            value: z.number(),
            currency: z.string(),
          }),
          payment_method: z.object({
            type: z.string(),
          }),
        })
      )
      .optional(),
    // Allow any additional fields from PagBank
  }).passthrough()
});
