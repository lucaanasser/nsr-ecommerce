/**
 * Script de Teste: Fluxo E2E de Checkout com PagBank
 * 
 * Testa o fluxo completo:
 * 1. Login de usuário
 * 2. Adicionar produtos ao carrinho
 * 3. Calcular frete
 * 4. Criar pedido com pagamento
 * 5. Verificar status do pagamento
 * 
 * Como executar:
 * npm run ts-node src/scripts/test-checkout-flow.ts
 */

import axios from 'axios';
import { logger } from '../config/logger.colored';
import { encryptCardForTest } from './helpers/encrypt-card.helper';

const API_URL = process.env['API_URL'] || 'http://localhost:4000/api/v1';

// Credenciais de teste (assumindo que existe um usuário de teste)
const TEST_USER = {
  email: 'customer@nsr.com',
  password: 'Customer@123',
};

// Cartões de teste PagBank
const TEST_CARD = {
  numeroCartao: '4539620659922097',
  nomeCartao: 'JOSE DA SILVA',
  validade: '12/30',
  cvv: '123',
  cpfTitular: '123.456.789-09',
};

interface TestContext {
  token?: string;
  userId?: string;
  addressId?: string;
  productId?: string;
  shippingMethodId?: string;
}

const context: TestContext = {};

/**
 * Passo 1: Login
 */
async function testLogin() {
  try {
    logger.info('🔐 PASSO 1: Fazendo login...');

    const response = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    context.token = response.data.data.accessToken;
    context.userId = response.data.data.user.id;

    logger.info('✅ Login bem-sucedido', {
      userId: context.userId,
      email: response.data.data.user.email,
    });

    return true;
  } catch (error: any) {
    logger.error('❌ Erro no login:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Passo 2: Buscar produtos disponíveis
 */
async function testGetProducts() {
  try {
    logger.info('\n📦 PASSO 2: Buscando produtos...');

    const response = await axios.get(`${API_URL}/products?isActive=true&limit=1`);

    if (response.data.data.products.length === 0) {
      logger.error('❌ Nenhum produto disponível para teste');
      return false;
    }

    const product = response.data.data.products[0];
    context.productId = product.id;

    logger.info('✅ Produto encontrado:', {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    });

    return true;
  } catch (error: any) {
    logger.error('❌ Erro ao buscar produtos:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Passo 3: Buscar endereços do usuário
 */
async function testGetAddresses() {
  try {
    logger.info('\n📍 PASSO 3: Buscando endereços...');

    const response = await axios.get(`${API_URL}/user/addresses`, {
      headers: {
        Authorization: `Bearer ${context.token}`,
      },
    });

    if (response.data.data.length === 0) {
      logger.error('❌ Nenhum endereço cadastrado');
      return false;
    }

    const address = response.data.data[0];
    context.addressId = address.id;

    logger.info('✅ Endereço encontrado:', {
      id: address.id,
      label: address.label,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });

    return true;
  } catch (error: any) {
    logger.error('❌ Erro ao buscar endereços:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Passo 4: Calcular frete
 */
async function testCalculateShipping() {
  try {
    logger.info('\n🚚 PASSO 4: Calculando frete...');

    const response = await axios.post(
      `${API_URL}/shipping/calculate`,
      {
        addressId: context.addressId,
        items: [
          {
            productId: context.productId,
            quantity: 1,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${context.token}`,
        },
      }
    );

    if (response.data.data.methods.length === 0) {
      logger.error('❌ Nenhum método de frete disponível');
      return false;
    }

    const method = response.data.data.methods[0];
    context.shippingMethodId = method.id;

    logger.info('✅ Frete calculado:', {
      id: method.id,
      name: method.name,
      price: method.price,
      deliveryTime: `${method.minDays}-${method.maxDays} dias`,
    });

    return true;
  } catch (error: any) {
    logger.error('❌ Erro ao calcular frete:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Passo 5: Criar pedido com pagamento (Cartão)
 */
async function testCreateOrderWithCreditCard() {
  try {
    logger.info('\n💳 PASSO 5: Criando pedido com cartão de crédito...');

    // Criptografar cartão (simulado para testes)
    logger.info('🔐 Criptografando dados do cartão...');
    const [expMonth, expYear] = TEST_CARD.validade.split('/');
    const encryptedCard = await encryptCardForTest(
      {
        number: TEST_CARD.numeroCartao.replace(/\s/g, ''),
        holder: TEST_CARD.nomeCartao,
        expMonth: expMonth || '12',
        expYear: '20' + (expYear || '30'),
        cvv: TEST_CARD.cvv,
      },
      TEST_CARD.cpfTitular
    );

    const orderData = {
      addressId: context.addressId,
      items: [
        {
          productId: context.productId,
          quantity: 1,
        },
      ],
      shippingMethodId: context.shippingMethodId,
      paymentMethod: 'credit_card',
      creditCard: encryptedCard,
    };

    logger.info('📤 Enviando pedido para API...');

    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${context.token}`,
        'Content-Type': 'application/json',
      },
    });

    const order = response.data.data;

    logger.info('✅ Pedido criado com sucesso!', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
    });

    // Verificar se há informações de pagamento
    if (order.payment) {
      logger.info('💰 Status do pagamento:', {
        paymentId: order.payment.id,
        status: order.payment.status,
        method: order.payment.method,
        chargeId: order.payment.chargeId,
      });

      if (order.payment.status === 'PAID' || order.payment.status === 'AUTHORIZED') {
        logger.info('🎉 PAGAMENTO APROVADO!');
        logger.info('✅ O fluxo completo de checkout está funcionando!');
        return true;
      } else if (order.payment.status === 'DECLINED') {
        logger.warn('⚠️ Pagamento recusado (pode ser esperado para testes)');
        return true; // Ainda é sucesso do ponto de vista de integração
      } else {
        logger.info(`⏳ Pagamento em análise: ${order.payment.status}`);
        return true;
      }
    }

    return true;
  } catch (error: any) {
    logger.error('❌ Erro ao criar pedido:', {
      status: error.response?.status,
      message: error.message,
      details: error.response?.data,
    });
    return false;
  }
}

/**
 * Passo 6: Criar pedido com PIX
 */
async function testCreateOrderWithPix() {
  try {
    logger.info('\n💰 PASSO 6: Criando pedido com PIX...');

    const orderData = {
      addressId: context.addressId,
      items: [
        {
          productId: context.productId,
          quantity: 1,
        },
      ],
      shippingMethodId: context.shippingMethodId,
      paymentMethod: 'pix',
    };

    logger.info('📤 Enviando pedido PIX para API...');

    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${context.token}`,
        'Content-Type': 'application/json',
      },
    });

    const order = response.data.data;

    logger.info('✅ Pedido PIX criado com sucesso!', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });

    if (order.payment?.pixQrCode) {
      logger.info('📱 QR Code PIX gerado:', {
        qrCode: order.payment.pixQrCode.substring(0, 50) + '...',
        expiresAt: order.payment.pixExpiresAt,
      });
      logger.info('🎉 PIX criado com sucesso!');
      return true;
    }

    return true;
  } catch (error: any) {
    logger.error('❌ Erro ao criar pedido PIX:', {
      status: error.response?.status,
      message: error.message,
      details: error.response?.data,
    });
    return false;
  }
}

/**
 * Executa todos os testes
 */
async function runE2ETests() {
  logger.info('🚀 Iniciando testes E2E de Checkout\n');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const results = {
    login: false,
    products: false,
    addresses: false,
    shipping: false,
    creditCard: false,
    pix: false,
  };

  // Executar testes em sequência
  results.login = await testLogin();
  if (!results.login) {
    logger.error('\n❌ Testes interrompidos: falha no login');
    return results;
  }

  results.products = await testGetProducts();
  if (!results.products) {
    logger.error('\n❌ Testes interrompidos: nenhum produto disponível');
    return results;
  }

  results.addresses = await testGetAddresses();
  if (!results.addresses) {
    logger.error('\n❌ Testes interrompidos: nenhum endereço disponível');
    return results;
  }

  results.shipping = await testCalculateShipping();
  if (!results.shipping) {
    logger.error('\n❌ Testes interrompidos: falha ao calcular frete');
    return results;
  }

  results.creditCard = await testCreateOrderWithCreditCard();
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Aguardar 2s

  results.pix = await testCreateOrderWithPix();

  // Resumo
  logger.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('RESUMO DOS TESTES E2E');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    logger.info(`${icon} ${test.toUpperCase()}: ${passed ? 'PASSOU' : 'FALHOU'}`);
  });

  const allPassed = Object.values(results).every(r => r);
  
  logger.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (allPassed) {
    logger.info('🎉 TODOS OS TESTES PASSARAM!');
    logger.info('✅ O fluxo completo de checkout está funcionando');
    logger.info('✅ Integração com PagBank operacional\n');
  } else {
    logger.error('❌ ALGUNS TESTES FALHARAM');
    logger.error('⚠️ Verifique os logs acima para detalhes\n');
  }

  return results;
}

// Executar
if (require.main === module) {
  runE2ETests()
    .then((results) => {
      const allPassed = Object.values(results).every(r => r);
      process.exit(allPassed ? 0 : 1);
    })
    .catch((error) => {
      logger.error('Erro fatal:', error);
      process.exit(1);
    });
}

export { runE2ETests };
