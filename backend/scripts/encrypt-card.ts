/**
 * Script para criptografar dados de cartão usando a mesma lógica do frontend
 * Usa a biblioteca node-rsa para criptografia RSA com a chave pública do PagBank
 * 
 * Uso:
 *   npx tsx scripts/encrypt-card.ts
 */

import { publicEncrypt, constants } from 'crypto';

// Chave pública do PagBank (mesma do frontend)
const PUBLIC_KEY_BASE64 = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E3Lqz58j+sS7UJqCAHCMxYsNFcHhcNwGp7rr6KuNnD6uRq5VbFBN/xsxCZvvxDPqwXK5tQkM1VpBPYE+FStQdxoMjPiVUxTWYxCNMOlXcuMh7KgL+J6NeM8xhKBSCXeMjXcG1RmWYhWVHvPp5JW6V0vBLnDFvHsz2GCVPpN+JVCEvmFR6cSqTMYaDfaOTR5vQz2z3sJm0BqYXQjgdqnMzp1m7JMa1vvDcX1vBJxg5G6QP0RJt9WKjw4KqM5IxmVqJQIDAQAB';

// Dados do cartão de teste do PagBank (Visa aprovado)
const CARD_DATA = {
  number: '4539620659922097',
  holder: 'JOSE DA SILVA',
  expMonth: '12',
  expYear: '2030',
  securityCode: '123',
};

function encryptCard() {
  console.log('🔐 Criptografando dados do cartão...\n');
  console.log('📋 Dados do cartão:');
  console.log('   Número:', CARD_DATA.number);
  console.log('   Titular:', CARD_DATA.holder);
  console.log('   Validade:', `${CARD_DATA.expMonth}/${CARD_DATA.expYear}`);
  console.log('   CVV:', CARD_DATA.securityCode);
  console.log('');

  try {
    // Converter chave base64 para PEM
    const pemKey = `-----BEGIN PUBLIC KEY-----\n${PUBLIC_KEY_BASE64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;

    // Criar string com dados do cartão no formato esperado pelo PagBank
    const cardString = JSON.stringify({
      holder: CARD_DATA.holder,
      number: CARD_DATA.number,
      expMonth: CARD_DATA.expMonth,
      expYear: CARD_DATA.expYear,
      securityCode: CARD_DATA.securityCode,
    });

    console.log('📝 Dados a serem criptografados:', cardString);
    console.log('');

    // Criptografar usando RSA PKCS1 padding (mesmo que o PagBank usa)
    const encrypted = publicEncrypt(
      {
        key: pemKey,
        padding: constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(cardString, 'utf8')
    );

    const encryptedBase64 = encrypted.toString('base64');

    console.log('✅ Cartão criptografado com sucesso!\n');
    console.log('🔑 String criptografada:');
    console.log(encryptedBase64);
    console.log('\n');
    console.log('📝 Tamanho:', encryptedBase64.length, 'caracteres');
    console.log('\n💡 Use esta string no campo "encrypted" do script test-payment.sh\n');

    return encryptedBase64;
  } catch (error: any) {
    console.error('❌ Erro ao criptografar:', error.message);
    process.exit(1);
  }
}

encryptCard();
