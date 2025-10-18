import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config, validateConfig } from '@config/env';
import { logger, morganStream } from '@config/logger';
import { prisma } from '@config/database';
import { verifyEmailConnection } from '@config/email';
import { swaggerSpec } from '@config/swagger';
import { errorHandler, notFoundHandler } from '@middlewares/errorHandler';
import routes from '@routes/index';

// Criar aplicação Express
export const app: Application = express();

// ================================
// MIDDLEWARES GLOBAIS
// ================================

// Segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logging
app.use(morgan('combined', { stream: morganStream }));

// ================================
// SWAGGER DOCUMENTATION
// ================================
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NSR E-commerce API Docs',
}));

// ================================
// ROTAS
// ================================
app.use(routes);

// ================================
// ERROR HANDLING
// ================================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ================================
// INICIALIZAÇÃO
// ================================

export async function startServer(): Promise<void> {
  try {
    // Validar configuração
    validateConfig();
    logger.info('✓ Configuration validated');
    
    // Conectar ao banco
    await prisma.$connect();
    logger.info('✓ Database connected');
    
    // Verificar conexão de email (não bloqueante)
    await verifyEmailConnection();
    
    // Iniciar servidor
    app.listen(config.port, () => {
      logger.info(`✓ Server running on port ${config.port}`);
      logger.info(`✓ Environment: ${config.env}`);
      logger.info(`✓ Health check: http://localhost:${config.port}/health`);
      logger.info(`✓ API info: http://localhost:${config.port}/api/v1`);
      logger.info(`✓ API docs: http://localhost:${config.port}/api/docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
