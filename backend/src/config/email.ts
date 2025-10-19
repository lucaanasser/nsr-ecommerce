/**
 * Configuração do serviço de email usando Nodemailer.
 * Define transporter, verificação de conexão e opções padrão de envio.
 */
import nodemailer from 'nodemailer';
import { config } from './env';
import { logger } from '@config/logger.colored';

/**
 * Configuração do transporter de email usando Nodemailer
 */
export const emailTransporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

/**
 * Verifica se a conexão com o servidor de email está funcionando
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await emailTransporter.verify();
    logger.info('✅ Email service ready');
    return true;
  } catch (error) {
    logger.warn('⚠️  Email service not configured properly', { error });
    return false;
  }
}

/**
 * Configuração padrão para emails
 */
export const emailDefaults = {
  from: config.email.from,
  replyTo: config.email.from,
} as const;
