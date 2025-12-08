/**
 * Script de teste para validar integração com PagBank
 * 
 * Para rodar: npx tsx src/scripts/test-pagbank.ts
 */
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do .env.dev ANTES de importar outros módulos
dotenv.config({ path: '.env.dev' });

import { pagbankService } from '../services/pagbank.service';
import { logger } from '../config/logger.colored';

async function testPixCharge() {
  console.log('\n🔵 Testando criação de cobrança PIX...\n');

  try {
    const result = await pagbankService.createPixCharge({
      orderId: `TEST-PIX-${Date.now()}`,
      amount: 50.00, // R$ 50,00
      method: 'PIX',
      customer: {
        name: 'Cliente Teste',
        email: 'cliente.teste@email.com', // Email diferente do merchant
        cpf: '12345678909', // CPF de teste válido
        phone: '11999999999',
      },
      address: {
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310100',
      },
      items: [
        {
          name: 'Camiseta NSR',
          quantity: 1,
          unitAmount: 50.00,
        },
      ],
    });

    console.log('✅ Resultado da cobrança PIX:');
    console.log('   - Success:', result.success);
    console.log('   - Charge ID:', result.chargeId);
    console.log('   - Status:', result.status);
    
    if (result.pixQrCode) {
      console.log('\n📱 Dados do PIX:');
      console.log('   - QR Code (copia e cola):', result.pixQrCode);
      console.log('   - Expira em:', result.pixExpiresAt);
      console.log('   - Imagem QR Code:', result.pixQrCodeImage);
    }

    if (result.errorMessage) {
      console.log('\n❌ Erro:', result.errorMessage);
      console.log('   - Código:', result.errorCode);
    }

    return result;
  } catch (error) {
    console.error('❌ Erro ao criar cobrança PIX:', error);
    throw error;
  }
}

async function testCreditCardCharge() {
  console.log('\n💳 Testando criação de cobrança com Cartão de Crédito...\n');

  // NOTA: Para testar cartão, você precisa criptografar os dados do cartão
  // usando a biblioteca JavaScript do PagBank no frontend ou a chave pública
  console.log('⚠️  Teste de cartão requer criptografia dos dados.');
  console.log('    Por enquanto, vamos pular este teste.');
  console.log('    Dados de teste do PagBank sandbox:');
  console.log('    - Cartão aprovado: 4111 1111 1111 1111');
  console.log('    - CVV: 123');
  console.log('    - Validade: qualquer data futura');
  console.log('    - CPF titular: 12345678909');
}

async function testChargeStatus(chargeId: string) {
  console.log(`\n🔍 Consultando status da cobrança ${chargeId}...\n`);

  try {
    const result = await pagbankService.getChargeStatus(chargeId);

    console.log('✅ Status da cobrança:');
    console.log('   - Success:', result.success);
    console.log('   - Charge ID:', result.chargeId);
    console.log('   - Status:', result.status);

    return result;
  } catch (error) {
    console.error('❌ Erro ao consultar status:', error);
    throw error;
  }
}

async function main() {
  console.log('=================================================');
  console.log('🧪 TESTE DE INTEGRAÇÃO PAGBANK - SANDBOX');
  console.log('=================================================');

  try {
    // Teste 1: Criar cobrança PIX
    const pixResult = await testPixCharge();

    // Teste 2: Consultar status (se criou com sucesso)
    if (pixResult.chargeId) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Aguardar 2 segundos
      await testChargeStatus(pixResult.chargeId);
    }

    // Teste 3: Informações sobre cartão
    await testCreditCardCharge();

    console.log('\n=================================================');
    console.log('✅ Testes concluídos!');
    console.log('=================================================\n');
  } catch (error) {
    console.log('\n=================================================');
    console.log('❌ Testes falharam!');
    console.log('=================================================\n');
    logger.error('Test failed', { error });
    process.exit(1);
  }
}

// Executar testes
main();
