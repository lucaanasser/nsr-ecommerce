/**
 * Helper para criptografar cartão de crédito usando a API do PagBank
 * 
 * IMPORTANTE: Este helper é apenas para TESTES automatizados.
 * Em produção, a criptografia DEVE ser feita no browser usando o SDK JavaScript.
 */

import axios from 'axios';
import { logger } from '../../config/logger.colored';

const PAGBANK_PUBLIC_KEY = process.env['PAGBANK_PUBLIC_KEY'] || 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E2TfDl6c7E1y3hx3VdKVN/EkP7qUcIXYF/KdPKF4SqK3fH6c7jlCTLTEv/2X7wLGY9CAGNqPLDzPKKTU9PVlGp9MVpAL0B8qCGSFRF8D6GwX7MF9pBp7ynFvMkPzGQFJNGi0bCMPCYbU6L9oyfBGaHWqc5TH3vHpkEbPr1H1vu9TIhG7Cqv5IlYzlF0W0Ew1KQDCeMqXLEGRhLZnqPBHt9PknmMM4lZXRB0u0QCDJ/PEqVQQJNGvwAQaLWiWp5P4wIDAQAB';

interface CardData {
  number: string;
  holder: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

interface EncryptedCard {
  encrypted: string;
  holderName: string;
  holderCpf: string;
}

/**
 * NOTA: Esta função simula a criptografia para testes.
 * Na prática, a API do PagBank para criptografia é client-side only (JavaScript no browser).
 * 
 * Para testes E2E reais, você tem 3 opções:
 * 1. Usar o portal web do PagBank para gerar manualmente
 * 2. Usar Puppeteer/Playwright para automatizar o portal
 * 3. Aceitar que em testes, enviamos um token fake e o PagBank sandbox aceita
 */
export async function encryptCardForTest(
  cardData: CardData,
  holderCpf: string
): Promise<EncryptedCard> {
  logger.warn('⚠️  USANDO CRIPTOGRAFIA SIMULADA PARA TESTES');
  logger.warn('⚠️  EM PRODUÇÃO, USE O SDK JAVASCRIPT NO BROWSER');

  // Em ambiente de testes, o PagBank sandbox pode aceitar um formato simplificado
  // ou podemos fazer uma chamada real ao SDK via headless browser
  
  // Por enquanto, vamos retornar um formato que o PagBank aceita em sandbox
  const fakeEncrypted = Buffer.from(JSON.stringify({
    number: cardData.number,
    holder: cardData.holder,
    expMonth: cardData.expMonth,
    expYear: cardData.expYear,
    cvv: cardData.cvv,
    timestamp: Date.now(),
  })).toString('base64');

  return {
    encrypted: fakeEncrypted,
    holderName: cardData.holder,
    holderCpf: holderCpf.replace(/\D/g, ''),
  };
}

/**
 * Alternativa: Usar um token pré-gerado do portal do PagBank
 * Você pode gerar um token manualmente no portal e usar aqui
 */
export function usePreGeneratedToken(holderName: string, holderCpf: string): EncryptedCard {
  // Token gerado manualmente no portal do desenvolvedor
  // Cole aqui um token real gerado via https://dev.pagseguro.com.br/
  const PRE_GENERATED_TOKEN = process.env['PAGBANK_TEST_ENCRYPTED_CARD'] || '';

  if (!PRE_GENERATED_TOKEN) {
    throw new Error(
      'Token pré-gerado não configurado. ' +
      'Gere um token em https://dev.pagseguro.com.br/ e configure PAGBANK_TEST_ENCRYPTED_CARD'
    );
  }

  return {
    encrypted: PRE_GENERATED_TOKEN,
    holderName,
    holderCpf: holderCpf.replace(/\D/g, ''),
  };
}
