/**
 * Script para testar pagamento com cartão de crédito
 * 
 * Uso:
 *   npx tsx scripts/test-payment.ts
 * 
 * Para testar com dados diferentes, edite as variáveis abaixo
 */

import axios from 'axios';

// =============================================================================
// CONFIGURAÇÕES - EDITE AQUI
// =============================================================================

const API_URL = 'http://localhost:4000/api/v1';

// Token do usuário (customer@nsr.com)
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjdlNGQzZi0wM2UwLTQwNzAtYmQxZC01NDllMTljYzEzMDMiLCJlbWFpbCI6ImN1c3RvbWVyQG5zci5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MjU1NjI2LCJleHAiOjE3NjUyNTY1MjYsImF1ZCI6Im5zci1hcGkiLCJpc3MiOiJuc3ItZWNvbW1lcmNlIn0.T5mTf3ZxAGiXnscoihvCVoxIJ4d6PB7t1Z02KlHd0BQ';

// ID do endereço (busque com GET /user/addresses)
const ADDRESS_ID = '76539a9c-8302-48d9-bf2b-cb499b641935';

// ID do método de envio (busque com POST /shipping/calculate)
const SHIPPING_METHOD_ID = '550e8400-e29b-41d4-a716-446655440020'; // PAC

// Cartão de crédito (use um dos cartões de teste do PagBank)
const CREDIT_CARD = {
  // Cartão Visa aprovado: 4539 6206 5992 2097
  encrypted: 'NwYcLPZJssWgZufJbG8+xTHiRrqDd01jBAeTX9NzCXHW2H28GZLObgh7UH+/s2RvynQUETXnO25zqsPRMxA2G0bPe4Ftmsk8dwrCQNcyOWICoMkfKsXDqUFl9HyVvEBOo/dBBP9iWfXhw2uHqGVlO8urOLUHp4ZHDrZZQ+GY4syGXis5tRvMRpcnA7n1lg0xePCy6NJKjeOQU4FbwHq1ImILDQ3f/w67eelRxX/PhjRDya1TPtKgoEwLw4bMtj1ZKGm/IlbMg/K9MySY7ZZ56etGzlt9hjTRKqw+7U0e6j0Ft9zvKcf6sVNrvi99PEvKWrGFCwvjQcTIJC8tzOV3bw==',
  holderName: 'JOSE DA SILVA',
  holderCpf: '12173958658',
};

// Produto para comprar (Moletom Medina)
const PRODUCT_ID = '550e8400-e29b-41d4-a716-446655440003';
const QUANTITY = 1;

// =============================================================================
// SCRIPT
// =============================================================================

interface OrderPayload {
  addressId: string;
  items: Array<{
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  shippingMethodId: string;
  paymentMethod: 'credit_card' | 'pix';
  creditCard?: {
    encrypted: string;
    holderName: string;
    holderCpf: string;
  };
  notes?: string;
}

async function testPayment() {
  console.log('🚀 Iniciando teste de pagamento...\n');

  try {
    // 1. Preparar payload
    const payload: OrderPayload = {
      addressId: ADDRESS_ID,
      items: [
        {
          productId: PRODUCT_ID,
          quantity: QUANTITY,
        },
      ],
      shippingMethodId: SHIPPING_METHOD_ID,
      paymentMethod: 'credit_card',
      creditCard: CREDIT_CARD,
      notes: 'Teste de pagamento via script',
    };

    console.log('📦 Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('\n');

    // 2. Fazer requisição
    console.log('📡 Enviando requisição para:', `${API_URL}/orders`);
    console.log('🔑 Token:', AUTH_TOKEN.substring(0, 50) + '...\n');

    const response = await axios.post(`${API_URL}/orders`, payload, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // 3. Sucesso
    console.log('✅ Pedido criado com sucesso!\n');
    console.log('📋 Resposta:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n');
    console.log('✨ Order ID:', response.data.id);
    console.log('✨ Order Number:', response.data.orderNumber);
    console.log('✨ Status:', response.data.status);
    console.log('✨ Total:', `R$ ${(response.data.total / 100).toFixed(2)}`);

  } catch (error: any) {
    console.error('❌ Erro ao criar pedido:\n');
    
    if (error.response) {
      // Erro da API
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // Sem resposta
      console.error('Sem resposta do servidor');
      console.error('Request:', error.request);
    } else {
      // Erro na configuração
      console.error('Erro:', error.message);
    }
    
    process.exit(1);
  }
}

// Executar
testPayment();
