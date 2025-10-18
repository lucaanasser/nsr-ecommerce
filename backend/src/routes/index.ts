import { Router } from 'express';
import { prisma } from '@config/database';
import { logger } from '@config/logger';
import { config } from '@config/env';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     description: Returns the health status of the API and database connection
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 *                 database:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: Service is unhealthy
 */
router.get('/health', async (_req, res) => {
  try {
    // Verificar conexão com o banco
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.env,
      database: 'connected',
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: config.env,
      database: 'disconnected',
    });
  }
});

/**
 * @swagger
 * /api/v1:
 *   get:
 *     tags: [Health]
 *     summary: API information
 *     description: Returns general information about the API and available endpoints
 *     responses:
 *       200:
 *         description: API information
 */
router.get('/api/v1', (_req, res) => {
  res.status(200).json({
    name: 'NSR E-commerce API',
    version: '1.0.0',
    description: 'Backend REST API for NSR E-commerce',
    endpoints: {
      health: '/health',
      docs: '/api/docs',
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders',
      admin: '/api/v1/admin',
    },
  });
});

// Importar rotas quando forem criadas
// import authRoutes from './auth.routes';
// import productRoutes from './product.routes';
// router.use('/api/v1/auth', authRoutes);
// router.use('/api/v1/products', productRoutes);

export default router;
