/**
 * Script para criptografar dados de cartão usando PagBank SDK
 * e fazer teste de pagamento
 * 
 * Uso:
 *   npx tsx scripts/encrypt-and-pay.ts
 */

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjdlNGQzZi0wM2UwLTQwNzAtYmQxZC01NDllMTljYzEzMDMiLCJlbWFpbCI6ImN1c3RvbWVyQG5zci5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MjU1NjI2LCJleHAiOjE3NjUyNTY1MjYsImF1ZCI6Im5zci1hcGkiLCJpc3MiOiJuc3ItZWNvbW1lcmNlIn0.T5mTf3ZxAGiXnscoihvCVoxIJ4d6PB7t1Z02KlHd0BQ';

// Chave pública do PagBank (sandbox)
const PAGBANK_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E3r5lKRSaM5TQvPGaT3Y+CPb5hNJq2S8xYBqTgWjqgMtHH4tL+yuKh+xH8rBZTDt4+OXlBmPp9u0dWHvAL2uyNbpN0TIxLYGJFQvH8fVAm/Qg7dF5X9rBaGjKD7m84Yl7eBzIxUECcN7I5OkQqSBvjLs+aRu1mPyp0oXQWW8zQNnxqsGXNn/9pPrx7cqjqZNl8TDVF15nGmUKZD6AVbN8t5DpmjVKQfVLNm1JqHYGkHbL3pKz2WmWvYqnMN6QIDAQAB';

// Dados do cartão de teste (Visa aprovado)
const CARD_DATA = {
  number: '4539620659922097',
  holder: 'JOSE DA SILVA',
  expMonth: '12',
  expYear: '2030',
  cvv: '123',
  holderCpf: '12173958658',
};

// IDs necessários
const ADDRESS_ID = '76539a9c-8302-48d9-bf2b-cb499b641935';
const PRODUCT_ID = '550e8400-e29b-41d4-a716-446655440003';
const SHIPPING_METHOD_ID = 'cd392b44-f342-491e-9fbe-b10d7ba93228';

/**
 * Criptografa cartão usando a API do PagBank
 * (Simula o que o frontend faz)
 */
async function encryptCard() {
  console.log('🔐 Criptografando cartão de crédito...\n');
  
  try {
    // O PagBank SDK no browser faz uma chamada para a API deles
    // Vamos simular isso chamando a API do PagBank diretamente
    const response = await axios.post(
      'https://sandbox.api.pagseguro.com/public/v1/encrypt',
      {
        publicKey: PAGBANK_PUBLIC_KEY,
        card: {
          holder: CARD_DATA.holder,
          number: CARD_DATA.number,
          expMonth: CARD_DATA.expMonth,
          expYear: CARD_DATA.expYear,
          securityCode: CARD_DATA.cvv,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('✅ Cartão criptografado com sucesso!\n');
    return response.data.encryptedCard;
  } catch (error: any) {
    if (error.response) {
      console.error('❌ Erro na API do PagBank:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Erro:', error.message);
    }
    
    // Se a API não funcionar, vamos usar o criptograma que você forneceu
    console.log('\n⚠️  Usando criptograma pré-gerado...\n');
    return 'NwYcLPZJssWgZufJbG8+xTHiRrqDd01jBAeTX9NzCXHW2H28GZLObgh7UH+/s2RvynQUETXnO25zqsPRMxA2G0bPe4Ftmsk8dwrCQNcyOWICoMkfKsXDqUFl9HyVvEBOo/dBBP9iWfXhw2uHqGVlO8urOLUHp4ZHDrZZQ+GY4syGXis5tRvMRpcnA7n1lg0xePCy6NJKjeOQU4FbwHq1ImILDQ3f/w67eelRxX/PhjRDya1TPtKgoEwLw4bMtj1ZKGm/IlbMg/K9MySY7ZZ56etGzlt9hjTRKqw+7U0e6j0Ft9zvKcf6sVNrvi99PEvKWrGFCwvjQcTIJC8tzOV3bw==';
  }
}

/**
 * Cria pedido com pagamento
 */
async function createOrder(encryptedCard: string) {
  console.log('📦 Criando pedido...\n');

  const payload = {
    addressId: ADDRESS_ID,
    items: [
      {
        productId: PRODUCT_ID,
        quantity: 1,
      },
    ],
    shippingMethodId: SHIPPING_METHOD_ID,
    paymentMethod: 'credit_card',
    creditCard: {
      encrypted: encryptedCard,
      holderName: CARD_DATA.holder,
      holderCpf: CARD_DATA.holderCpf,
    },
    notes: 'Teste com cartão real criptografado',
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('\n');

  try {
    const response = await axios.post(`${API_URL}/orders`, payload, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Pedido criado com sucesso!\n');
    console.log('📋 Resposta:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n');
    console.log('✨ Order Number:', response.data.data.orderNumber);
    console.log('✨ Status:', response.data.data.status);
    console.log('✨ Payment Status:', response.data.data.payment?.status);
    console.log('✨ Total:', `R$ ${response.data.data.total}`);

  } catch (error: any) {
    console.error('❌ Erro ao criar pedido:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Erro:', error.message);
    }
    
    process.exit(1);
  }
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Teste de pagamento com cartão real\n');
  console.log('Cartão:', `${CARD_DATA.number.substring(0, 4)} **** **** ${CARD_DATA.number.substring(12)}`);
  console.log('Titular:', CARD_DATA.holder);
  console.log('Validade:', `${CARD_DATA.expMonth}/${CARD_DATA.expYear}`);
  console.log('CVV:', CARD_DATA.cvv);
  console.log('\n' + '='.repeat(50) + '\n');

  // 1. Criptografar cartão
  const encryptedCard = await encryptCard();
  console.log('Encrypted:', encryptedCard.substring(0, 50) + '...');
  console.log('\n' + '='.repeat(50) + '\n');

  // 2. Criar pedido
  await createOrder(encryptedCard);
}

main();
