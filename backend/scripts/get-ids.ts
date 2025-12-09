/**
 * Script para buscar IDs necessários para o teste de pagamento
 * 
 * Uso:
 *   npx tsx scripts/get-ids.ts
 */

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

// Token do usuário customer@nsr.com
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjdlNGQzZi0wM2UwLTQwNzAtYmQxZC01NDllMTljYzEzMDMiLCJlbWFpbCI6ImN1c3RvbWVyQG5zci5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MjU1NjI2LCJleHAiOjE3NjUyNTY1MjYsImF1ZCI6Im5zci1hcGkiLCJpc3MiOiJuc3ItZWNvbW1lcmNlIn0.T5mTf3ZxAGiXnscoihvCVoxIJ4d6PB7t1Z02KlHd0BQ';

async function getIds() {
  console.log('🔍 Buscando IDs necessários...\n');

  try {
    // 1. Buscar endereços
    console.log('📍 Endereços disponíveis:');
    const addressesRes = await axios.get(`${API_URL}/user/addresses`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    
    const addresses = addressesRes.data.data || addressesRes.data || [];
    
    if (addresses.length === 0) {
      console.log('⚠️  Nenhum endereço encontrado. Crie um endereço primeiro!\n');
    } else {
      addresses.forEach((addr: any, i: number) => {
        console.log(`\n[${i + 1}] ID: ${addr.id}`);
        console.log(`    ${addr.street}, ${addr.number}${addr.complement ? ` - ${addr.complement}` : ''}`);
        console.log(`    ${addr.neighborhood}, ${addr.city} - ${addr.state}`);
        console.log(`    CEP: ${addr.zipCode}`);
      });
    }

    // 2. Buscar produtos
    console.log('\n\n📦 Produtos disponíveis:');
    const productsRes = await axios.get(`${API_URL}/products?limit=5`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    
    const products = productsRes.data.data?.products || productsRes.data.products || [];
    
    if (products.length === 0) {
      console.log('⚠️  Nenhum produto encontrado!\n');
    } else {
      products.forEach((prod: any, i: number) => {
        console.log(`\n[${i + 1}] ID: ${prod.id}`);
        console.log(`    Nome: ${prod.name}`);
        console.log(`    Preço: R$ ${(prod.price / 100).toFixed(2)}`);
        console.log(`    Estoque: ${prod.stock}`);
      });
    }

    // 3. Calcular frete (exemplo com primeiro endereço e produto)
    if (addresses.length > 0 && products.length > 0) {
      const firstAddress = addresses[0];
      const firstProduct = products[0];
      
      console.log('\n\n🚚 Calculando frete (exemplo):');
      console.log(`   Endereço: ${firstAddress.zipCode}`);
      console.log(`   Produto: ${firstProduct.name}`);
      
      try {
        const shippingRes = await axios.post(
          `${API_URL}/shipping/calculate`,
          {
            zipCode: firstAddress.zipCode,
            items: [
              {
                productId: firstProduct.id,
                quantity: 1,
              },
            ],
          },
          {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          }
        );
        
        console.log('\n   Métodos de envio disponíveis:');
        shippingRes.data.forEach((method: any, i: number) => {
          console.log(`\n   [${i + 1}] ID: ${method.id}`);
          console.log(`       Nome: ${method.name}`);
          console.log(`       Preço: R$ ${(method.price / 100).toFixed(2)}`);
          console.log(`       Prazo: ${method.deliveryTime} dias`);
        });
      } catch (err: any) {
        console.log('\n   ⚠️  Erro ao calcular frete:', err.response?.data?.message || err.message);
      }
    }

    console.log('\n\n✅ Busca concluída!');
    console.log('\n💡 Use esses IDs no script test-payment.ts\n');

  } catch (error: any) {
    console.error('❌ Erro:', error.response?.data || error.message);
    process.exit(1);
  }
}

getIds();
