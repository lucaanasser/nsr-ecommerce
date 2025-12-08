/**
 * Arquivo principal de configuração e inicialização da aplicação Express.
 * Responsável por registrar middlewares globais, rotas, documentação Swagger,
 * tratamento de erros, conexão com banco de dados, email e inicialização do servidor.
 * Também inicia o scheduler de retenção de dados (LGPD) e faz shutdown gracioso.
 */
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config, validateConfig } from '@config/env';
import { logger, morganStream } from '@config/logger.colored';
import { prisma } from '@config/database';
import { verifyEmailConnection } from '@config/email';
import { swaggerSpec } from '@config/swagger';
import { errorHandler, notFoundHandler } from '@middlewares/errorHandler';
import routes from '@routes/index';
import { dataRetentionScheduler } from './services/data-retention.scheduler';
import { paymentExpirationService } from './services/payment-expiration.service';

// Criar aplicação Express
export const app: Application = express();

// ================================
// MIDDLEWARES GLOBAIS
// ================================

// Segurança
// Em dev desabilitamos CSP para evitar bloqueio de chamadas cross-origin (frontend em outra porta)
app.use(helmet({
  contentSecurityPolicy: config.env === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false, // evita bloqueio de recursos remotos em dev
}));

// CORS - em desenvolvimento libera qualquer origem; em produção usa whitelist
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // requests sem origin (curl, healthchecks)

    // Em dev, aceitar qualquer origem para facilitar testes locais (localhost, 127.0.0.1, LAN)
    if (config.env !== 'production') return callback(null, true);

    // Em produção, permitir apenas origens configuradas
    if (config.cors.origin.includes(origin)) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
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
    
    // Iniciar scheduler de retenção de dados (LGPD)
    dataRetentionScheduler.start();
    logger.info('✓ Data retention scheduler started');
    
    // Iniciar scheduler de expiração de pagamentos
    paymentExpirationService.start();
    logger.info('✓ Payment expiration scheduler started');
    
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
  dataRetentionScheduler.stop();
  paymentExpirationService.stop();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  dataRetentionScheduler.stop();
  paymentExpirationService.stop();
  await prisma.$disconnect();
  process.exit(0);
});
