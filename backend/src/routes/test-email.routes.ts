/**
 * Rota temporária para teste de envio de emails
 */
import { Router, Request, Response } from 'express';
import { emailService } from '../services/email.service';
import { logger } from '@config/logger.colored';

const router = Router();

/**
 * @route   POST /api/v1/test-email/welcome
 * @desc    Testa envio de email de boas-vindas
 * @access  Public (TEMPORÁRIO - REMOVER EM PRODUÇÃO)
 */
router.post('/welcome', async (req: Request, res: Response) => {
  try {
    const { userName, userEmail } = req.body;
    
    logger.info('Testing welcome email', { userName, userEmail });
    
    const result = await emailService.sendWelcomeEmail({
      userName: userName || 'Teste',
      userEmail: userEmail || 'teste@example.com',
    });
    
    logger.info('Email test result', { result });
    
    res.status(200).json({
      success: true,
      message: 'Email test completed',
      data: result,
    });
  } catch (error) {
    logger.error('Email test failed', { error });
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
