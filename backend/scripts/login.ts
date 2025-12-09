/**
 * Script para fazer login e obter token
 * 
 * Uso:
 *   npx tsx scripts/login.ts
 */

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

async function login() {
  console.log('🔐 Fazendo login...\n');

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'customer@nsr.com',
      password: 'password123',
    });

    console.log('✅ Login realizado com sucesso!\n');
    console.log('📋 Resposta completa:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n');
    
    if (response.data.token || response.data.accessToken) {
      console.log('🔑 Token:', response.data.token || response.data.accessToken);
      console.log('\n💡 Copie o token acima e cole nos scripts test-payment.ts e get-ids.ts\n');
    }

  } catch (error: any) {
    console.error('❌ Erro ao fazer login:');
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

login();
