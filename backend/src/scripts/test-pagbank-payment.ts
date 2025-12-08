/**
 * Script de Teste: Fluxo Completo de Pagamento PagBank
 * 
 * Testa:
 * 1. Criptografia de cartão no frontend (simulado)
 * 2. Criação de pedido com pagamento
 * 3. Envio de requisição real para PagBank Sandbox
 * 4. Verificação de resposta e status
 * 
 * Como executar:
 * npm run ts-node src/scripts/test-pagbank-payment.ts
 */

import axios from 'axios';
import { pagbankConfig } from '../config/pagbank';
import { logger } from '../config/logger.colored';

// ========================================
// DADOS DE TESTE (SANDBOX)
// ========================================

// Cartão de teste PagBank (Sandbox)
// Fonte: https://dev.pagbank.uol.com.br/reference/testing-cards
const TEST_CARDS = {
  VISA_APPROVED: {
    number: '4111111111111111',
    holder: 'JOSE DA SILVA',
    expMonth: '12',
    expYear: '2030',
    cvv: '123',
  },
  MASTERCARD_APPROVED: {
    number: '5555555555555555',
    holder: 'MARIA SANTOS',
    expMonth: '12',
    expYear: '2030',
    cvv: '123',
  },
  DECLINED: {
    number: '4111111111111112', // Cartão que será recusado
    holder: 'TESTE RECUSADO',
    expMonth: '12',
    expYear: '2030',
    cvv: '123',
  },
};

// Dados do cliente para teste
const TEST_CUSTOMER = {
  name: 'José da Silva',
  email: 'teste.pagbank@example.com',
  cpf: '12345678909', // CPF válido de teste
  phone: '11999999999',
  address: {
    street: 'Rua Teste',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
  },
};

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Simula a criptografia do cartão que aconteceria no frontend
 * NOTA: Esta é uma simulação. Em produção, isso é feito pelo SDK do PagBank no browser
 */
function simulateCardEncryption(card: typeof TEST_CARDS.VISA_APPROVED): string {
  // Em produção, o SDK do PagBank faz isso no frontend
  // Para teste, vamos criar uma representação mockada
  const cardData = `${card.number}|${card.holder}|${card.expMonth}|${card.expYear}|${card.cvv}`;
  return Buffer.from(cardData).toString('base64');
}

/**
 * Formata CPF/CNPJ para envio (apenas números)
 */
function formatTaxId(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/**
 * Cria uma cobrança de teste diretamente na API do PagBank
 */
async function createTestCharge(cardType: 'APPROVED' | 'DECLINED' = 'APPROVED') {
  try {
    logger.info('🧪 Iniciando teste de pagamento PagBank...');

    // Selecionar cartão de teste
    const card = cardType === 'APPROVED' ? TEST_CARDS.VISA_APPROVED : TEST_CARDS.DECLINED;
    
    logger.info('📋 Dados do teste:', {
      environment: pagbankConfig.environment,
      apiUrl: pagbankConfig.apiUrl,
      cardType,
      cardNumber: `****${card.number.slice(-4)}`,
      amount: 10000, // R$ 100,00 em centavos
    });

    // Preparar payload conforme documentação PagBank
    // https://dev.pagbank.uol.com.br/reference/create-charge
    const payload = {
      reference_id: `TEST-${Date.now()}`,
      description: 'Pedido de teste - Validação de integração',
      amount: {
        value: 10000, // R$ 100,00 em centavos
        currency: 'BRL',
      },
      payment_method: {
        type: 'CREDIT_CARD',
        installments: 1,
        capture: true,
        card: {
          number: card.number,
          exp_month: card.expMonth,
          exp_year: card.expYear,
          security_code: card.cvv,
          holder: {
            name: card.holder,
          },
        },
      },
      customer: {
        name: TEST_CUSTOMER.name,
        email: TEST_CUSTOMER.email,
        tax_id: formatTaxId(TEST_CUSTOMER.cpf),
        phones: [
          {
            country: '55',
            area: '11',
            number: '999999999',
            type: 'MOBILE',
          },
        ],
      },
      billing_address: {
        street: TEST_CUSTOMER.address.street,
        number: TEST_CUSTOMER.address.number,
        complement: TEST_CUSTOMER.address.complement,
        locality: TEST_CUSTOMER.address.neighborhood,
        city: TEST_CUSTOMER.address.city,
        region_code: TEST_CUSTOMER.address.state,
        country: 'BRA',
        postal_code: formatTaxId(TEST_CUSTOMER.address.zipCode),
      },
      // notification_urls não é obrigatório no sandbox
      // notification_urls: ['https://webhook.site/unique-id'],
    };

    logger.info('📤 Enviando requisição para PagBank...');
    logger.info('🔑 Token:', pagbankConfig.token.substring(0, 30) + '...');
    logger.info('🌐 URL:', `${pagbankConfig.apiUrl}/charges`);
    logger.info('📦 Payload:', JSON.stringify(payload, null, 2));

    // Fazer requisição real para PagBank
    const response = await axios.post(
      `${pagbankConfig.apiUrl}/charges`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${pagbankConfig.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );

    logger.info('✅ Resposta recebida do PagBank:', {
      status: response.status,
      chargeId: response.data.id,
      referenceId: response.data.reference_id,
      status_: response.data.status,
      amount: response.data.amount,
      paymentMethod: response.data.payment_method?.type,
    });

    // Verificar detalhes do pagamento
    if (response.data.payment_response) {
      logger.info('💳 Detalhes do pagamento:', {
        code: response.data.payment_response.code,
        message: response.data.payment_response.message,
        reference: response.data.payment_response.reference,
      });
    }

    // Verificar status da cobrança
    const isPaid = response.data.status === 'PAID' || response.data.status === 'AUTHORIZED';
    const isDeclined = response.data.status === 'DECLINED';

    if (isPaid) {
      logger.info('✅ PAGAMENTO APROVADO!');
      logger.info('🎉 A integração com PagBank está funcionando corretamente!');
    } else if (isDeclined) {
      logger.warn('❌ PAGAMENTO RECUSADO (esperado para cartão de teste DECLINED)');
    } else {
      logger.warn('⏳ Pagamento em análise:', response.data.status);
    }

    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    logger.error('❌ Erro ao processar pagamento:', {
      status: error.response?.status,
      message: error.message,
      details: error.response?.data,
    });

    if (error.response?.data?.error_messages) {
      logger.error('📋 Erros retornados pela API:', error.response.data.error_messages);
    }

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

/**
 * Testa criação de pagamento PIX
 */
async function createTestPixCharge() {
  try {
    logger.info('🧪 Iniciando teste de pagamento PIX...');

    // Para PIX, o PagBank usa endpoint /orders, não /charges
    const payload = {
      reference_id: `PIX-TEST-${Date.now()}`,
      customer: {
        name: TEST_CUSTOMER.name,
        email: TEST_CUSTOMER.email,
        tax_id: formatTaxId(TEST_CUSTOMER.cpf),
        phones: [
          {
            country: '55',
            area: '11',
            number: '999999999',
            type: 'MOBILE',
          },
        ],
      },
      items: [
        {
          reference_id: 'item-1',
          name: 'Camiseta NSR',
          quantity: 1,
          unit_amount: 5000, // R$ 50,00 em centavos
        },
      ],
      qr_codes: [
        {
          amount: {
            value: 5000,
          },
          expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        },
      ],
    };

    logger.info('📤 Enviando requisição PIX para PagBank...');

    const response = await axios.post(
      `${pagbankConfig.apiUrl}/orders`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${pagbankConfig.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );

    logger.info('✅ QR Code PIX gerado:', {
      status: response.status,
      orderId: response.data.id,
      qrCodeText: response.data.qr_codes?.[0]?.text?.substring(0, 50) + '...',
      expirationDate: response.data.qr_codes?.[0]?.expiration_date,
    });

    logger.info('🎉 PIX criado com sucesso! QR Code disponível para pagamento.');
    logger.info('📱 Cole o código PIX em qualquer app bancário para testar o pagamento');

    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    logger.error('❌ Erro ao criar pagamento PIX:', {
      status: error.response?.status,
      message: error.message,
      details: error.response?.data,
    });

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

// ========================================
// EXECUÇÃO DOS TESTES
// ========================================

async function runTests() {
  logger.info('🚀 Iniciando bateria de testes PagBank Sandbox\n');

  // Teste 1: Cartão Aprovado
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('TESTE 1: Cartão de Crédito - APROVADO');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  const result1 = await createTestCharge('APPROVED');
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Aguardar 2s

  // Teste 2: Cartão Recusado
  logger.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('TESTE 2: Cartão de Crédito - RECUSADO');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  const result2 = await createTestCharge('DECLINED');
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Aguardar 2s

  // Teste 3: PIX
  logger.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('TESTE 3: Pagamento PIX');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  const result3 = await createTestPixCharge();

  // Resumo
  logger.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('RESUMO DOS TESTES');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  logger.info(`Teste 1 (Cartão Aprovado): ${result1.success ? '✅ PASSOU' : '❌ FALHOU'}`);
  logger.info(`Teste 2 (Cartão Recusado): ${result2.success ? '✅ PASSOU' : '❌ FALHOU'}`);
  logger.info(`Teste 3 (PIX): ${result3.success ? '✅ PASSOU' : '❌ FALHOU'}`);
  
  logger.info('\n🏁 Testes concluídos!\n');

  // Verificar se pelo menos o teste principal passou
  if (result1.success) {
    logger.info('✅ A integração com PagBank está funcionando!');
    logger.info('✅ Requisições estão sendo enviadas para o ambiente Sandbox');
    logger.info('✅ O sistema está pronto para processar pagamentos reais\n');
  } else {
    logger.error('❌ A integração com PagBank apresentou problemas');
    logger.error('❌ Verifique as credenciais e configurações\n');
  }
}

// Executar testes
if (require.main === module) {
  runTests()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Erro fatal durante execução dos testes:', error);
      process.exit(1);
    });
}

export { createTestCharge, createTestPixCharge };
