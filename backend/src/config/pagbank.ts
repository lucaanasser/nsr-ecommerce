/**
 * Configuração do PagBank (PagSeguro)
 * Gerencia credenciais e URLs da API de pagamentos
 */
import dotenv from 'dotenv';

// Carregar .env.dev se existir (para testes)
if (process.env['NODE_ENV'] !== 'production') {
  dotenv.config({ path: '.env.dev' });
}

export const pagbankConfig = {
  // Ambiente (sandbox ou production)
  environment: process.env['PAGBANK_ENV'] || 'sandbox',
  
  // Token de autenticação
  token: process.env['PAGBANK_TOKEN'] || '',
  
  // URL da API baseada no ambiente
  get apiUrl(): string {
    return this.environment === 'sandbox'
      ? 'https://sandbox.api.pagseguro.com'
      : 'https://api.pagseguro.com';
  },
  
  // URL pública para receber notificações de webhooks
  notificationUrl: process.env['PAGBANK_NOTIFICATION_URL'] || '',
  
  // Chave pública para criptografia de cartão no frontend
  publicKey: process.env['PAGBANK_PUBLIC_KEY'] || '',
  
  // Timeouts
  pixExpirationMinutes: 15, // PIX expira em 15 minutos
  orderExpirationHours: 24, // Pedidos expiram em 24h sem pagamento
} as const;

/**
 * Valida se as configurações essenciais do PagBank estão presentes
 */
export function validatePagBankConfig(): void {
  const errors: string[] = [];
  
  if (!pagbankConfig.token) {
    errors.push('PAGBANK_TOKEN is required');
  }
  
  if (!pagbankConfig.notificationUrl && pagbankConfig.environment === 'production') {
    errors.push('PAGBANK_NOTIFICATION_URL is required in production');
  }
  
  if (!['sandbox', 'production'].includes(pagbankConfig.environment)) {
    errors.push('PAGBANK_ENV must be either "sandbox" or "production"');
  }
  
  if (errors.length > 0) {
    throw new Error(`PagBank configuration errors:\n${errors.join('\n')}`);
  }
}
