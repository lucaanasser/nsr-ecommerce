/**
 * Logger customizado usando Winston e Chalk para logs coloridos e formatados.
 * Exporta logger para uso geral e morganStream para integração com morgan.
 */
import winston from 'winston';
import chalk from 'chalk';
import { config } from './env';

const { combine, timestamp, printf, errors } = winston.format;

const emojiLevel = (level: string) => {
  switch (level) {
    case 'error':
      return '❌ ERROR';
    case 'warn':
      return '⚠️ WARN';
    case 'info':
      return 'ℹ️ INFO';
    case 'success':
      return '✅ SUCCESS';
    case 'debug':
      return '🐞 DEBUG';
    default:
      return level.toUpperCase();
  }
};

const colorizeLevel = (level: string, message: string) => {
  switch (level) {
    case 'error':
      return chalk.red.bold(message);
    case 'warn':
      return chalk.yellow.bold(message);
    case 'info':
      return chalk.cyan(message);
    case 'success':
      return chalk.green.bold(message);
    case 'debug':
      return chalk.magenta(message);
    default:
      return message;
  }
};

const logFormat = printf(({ level, message, timestamp, stack }) => {
  const prefix = emojiLevel(level);
  const coloredMsg = colorizeLevel(level, String(message));
  if (level === 'error' && stack) {
    return `${chalk.gray(`[${timestamp}]`)} ${prefix}: ${coloredMsg}\n${chalk.gray(stack)}`;
  }
  return `${chalk.gray(`[${timestamp}]`)} ${prefix}: ${coloredMsg}`;
});

export const logger = winston.createLogger({
  level: config.debug ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
