import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';
import { validate } from '../middlewares/validate';
import { pagbankWebhookSchema } from '../validators/payment.validator';

const router = Router();

/**
 * @route   POST /api/v1/webhooks/pagbank
 * @desc    Handle PagBank payment notifications
 * @access  Public (no JWT auth - PagBank callback)
 * @note    Signature verification should be added for production
 */
router.post(
  '/pagbank',
  validate(pagbankWebhookSchema),
  webhookController.handlePagBankWebhook.bind(webhookController)
);

export default router;
