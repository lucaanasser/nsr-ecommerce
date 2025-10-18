import winston from 'winston';
import { config } from './env';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato customizado de logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} [${level}]: ${message}\n${stack}`;
  }
  return `${timestamp} [${level}]: ${message}`;
});

// Criar logger
export const logger = winston.createLogger({
  level: config.debug ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    
    // Arquivo de erros
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    
    // Arquivo de todos os logs
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Stream para Morgan (HTTP logging)
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
