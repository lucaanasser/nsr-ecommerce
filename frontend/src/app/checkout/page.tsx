'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

// Layouts
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

// Componentes de Checkout (locais)
import CheckoutSteps from './components/CheckoutSteps';
import CheckoutSummary from './components/CheckoutSummary';
import {
  DadosStep,
  EntregaStep,
  PagamentoStep,
  ConfirmacaoStep,
} from './components/steps';
import AddressTitleModal from './components/modals/AddressTitleModal';

// Hooks customizados (locais)
import { useCheckoutData } from './hooks/useCheckoutData';
import { useSavedAddresses } from './hooks/useSavedAddresses';

// Hooks globais
import { useCart } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';

// Services
import { addressService } from '@/services';
import type { SavedAddress, AuthUser } from '@/services';

/**
 * Página de Checkout - REFATORADA
 * Orquestra o fluxo de checkout em 4 etapas
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { itensCarrinho, obterTotalCarrinho, limparCarrinho } = useCart();
  const { user, isAuthenticated, register, refreshUser } = useAuthContext();
  
  // Hooks customizados para gerenciar estados
  const checkoutData = useCheckoutData();
  const { enderecosSalvos, carregandoEnderecos, carregarEnderecos } = useSavedAddresses(isAuthenticated);

  // ========================================
  // EFFECTS
  // ========================================

  // Verificar se pode pular etapa de dados automaticamente
  useEffect(() => {
    if (user && checkoutData.etapa === 'comprador') {
      const hasCpf = user.cpf && user.cpf.trim() !== '';
      const hasPhone = user.phone && user.phone.trim() !== '';
      
      // Se tem todos os dados, pula direto para entrega
      if (hasCpf && hasPhone) {
        console.log('[Checkout] ✅ Usuário com dados completos, pulando para entrega');
        checkoutData.setEtapa('destinatario');
      }
    }
  }, [user, checkoutData.etapa]);

  // ========================================
  // HANDLERS - DADOS DO COMPRADOR (Refatorado)
  // ========================================

  /**
   * Handler para login bem-sucedido no checkout
   * Atualiza contexto sem reload e mantém checkout
   */
  const handleLoginSuccess = async (loggedUser: AuthUser) => {
    try {
      console.log('🔄 Atualizando contexto após login...');
      // Atualizar contexto de autenticação SEM reload
      await refreshUser();
      console.log('✅ Contexto atualizado, DadosStep detectará o novo estado');
      // O DadosStep detectará automaticamente o novo estado
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
    }
  };

  /**
   * Handler para cadastro bem-sucedido no checkout
   * Usuário já está logado automaticamente após cadastro
   */
  const handleRegisterSuccess = async (registeredUser: AuthUser) => {
    try {
      console.log('🔄 Atualizando contexto após cadastro...');
      // Atualizar contexto de autenticação SEM reload
      await refreshUser();
      console.log('✅ Contexto atualizado, DadosStep detectará o novo estado');
      // O DadosStep detectará automaticamente o novo estado
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
    }
  };

  /**
   * Handler para completar dados faltantes (CPF/telefone)
   * Dados já foram salvos no perfil se usuário marcou checkbox
   */
  const handleCompleteData = async (updatedUser: AuthUser) => {
    try {
      console.log('🔄 Atualizando contexto e avançando para entrega...');
      // Atualizar contexto com novos dados SEM reload
      await refreshUser();
      console.log('✅ Dados atualizados, avançando para destinatário');
      // Avançar para próxima etapa
      checkoutData.setEtapa('destinatario');
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
    }
  };

  /**
   * Handler para continuar quando dados estão completos
   */
  const handleContinueDados = () => {
    checkoutData.setEtapa('destinatario');
  };

  // ========================================
  // FUNÇÕES - ENTREGA
  // ========================================

  const usarDadosComprador = () => {
    checkoutData.setDestinatarioIgualComprador(true);
    if (user) {
      checkoutData.setDadosDestinatario({
        nomeCompleto: `${user.firstName} ${user.lastName}`,
        telefone: user.phone || '',
      });
    }
  };

  // Função removida - não é mais necessária preencher dados pessoais na entrega

  const selecionarEndereco = (endereco: SavedAddress) => {
    checkoutData.setEnderecoSelecionadoId(endereco.id);
    checkoutData.setDadosEntrega((prev) => ({
      ...prev,
      cep: endereco.zipCode,
      endereco: endereco.street,
      numero: endereco.number,
      complemento: endereco.complement || '',
      bairro: endereco.neighborhood,
      cidade: endereco.city,
      estado: endereco.state,
    }));
  };

  const limparSelecaoEndereco = () => {
    checkoutData.setEnderecoSelecionadoId(null);
  };

  const handleSubmitEntrega = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se marcou para salvar e não tem endereço selecionado, pedir título
    if (checkoutData.salvarEndereco && !checkoutData.enderecoSelecionadoId && isAuthenticated) {
      checkoutData.setMostrarModalTitulo(true);
      return;
    }

    // Avança para pagamento
    checkoutData.setEtapa('pagamento');
  };

  const handleSalvarNovoEndereco = async () => {
    if (!checkoutData.tituloNovoEndereco.trim()) {
      alert('Por favor, dê um nome ao endereço');
      return;
    }

    try {
      const novoEndereco = await addressService.createAddress({
        label: checkoutData.tituloNovoEndereco,
        street: checkoutData.dadosEntrega.endereco,
        number: checkoutData.dadosEntrega.numero,
        complement: checkoutData.dadosEntrega.complemento || undefined,
        neighborhood: checkoutData.dadosEntrega.bairro,
        city: checkoutData.dadosEntrega.cidade,
        state: checkoutData.dadosEntrega.estado,
        zipCode: checkoutData.dadosEntrega.cep,
        receiverName: checkoutData.destinatarioIgualComprador 
          ? `${checkoutData.dadosComprador.nome} ${checkoutData.dadosComprador.sobrenome}`
          : checkoutData.dadosDestinatario.nomeCompleto,
        receiverPhone: checkoutData.destinatarioIgualComprador
          ? checkoutData.dadosComprador.telefone
          : checkoutData.dadosDestinatario.telefone,
        isDefault: enderecosSalvos.length === 0, // Primeiro endereço é padrão
      });

      // Recarregar endereços
      await carregarEnderecos();
      checkoutData.setEnderecoSelecionadoId(novoEndereco.id);
      checkoutData.setMostrarModalTitulo(false);
      checkoutData.setTituloNovoEndereco('');
      checkoutData.setSalvarEndereco(false);
      
      // Ir para próxima etapa
      checkoutData.setEtapa('pagamento');
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      alert('Erro ao salvar endereço. Tente novamente.');
    }
  };

  // ========================================
  // FUNÇÕES - PAGAMENTO
  // ========================================

  const handleSubmitPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    checkoutData.setEtapa('confirmacao');
  };

  // ========================================
  // FUNÇÕES - FINALIZAÇÃO
  // ========================================

  const handleFinalizarCompra = () => {
    // Aqui você faria a integração com o backend
    limparCarrinho();
    router.push('/');
    alert('Pedido realizado com sucesso!');
  };

  // ========================================
  // CÁLCULOS
  // ========================================

  const subtotal = obterTotalCarrinho();
  const frete = subtotal > 299 ? 0 : 29.90;
  const total = subtotal + frete;

  // ========================================
  // RENDERIZAÇÃO
  // ========================================

  // Verificar carrinho vazio
  if (itensCarrinho.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-dark-bg pt-24 pb-16">
          <Container>
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto mb-4 text-primary-white/30" />
              <h1 className="text-3xl font-bold mb-4">Carrinho Vazio</h1>
              <p className="text-primary-white/60 mb-8">
                Adicione produtos ao carrinho antes de finalizar a compra.
              </p>
              <Button onClick={() => router.push('/loja')}>
                Ir para a Loja
              </Button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-dark-bg pt-24 pb-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl md:text-5xl font-bold mb-8 text-primary-bronze"
              style={{ fontFamily: 'NSR, sans-serif' }}
            >
              Finalizar Compra
            </h1>

            {/* Indicador de Etapas */}
            <CheckoutSteps etapaAtual={checkoutData.etapa} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulários das Etapas */}
              <div className="lg:col-span-2">
                {/* Etapa 1: Dados */}
                {checkoutData.etapa === 'comprador' && (
                  <DadosStep
                    user={user}
                    onLoginSuccess={handleLoginSuccess}
                    onRegisterSuccess={handleRegisterSuccess}
                    onCompleteData={handleCompleteData}
                    onContinue={handleContinueDados}
                  />
                )}

                {/* Etapa 2: Entrega */}
                {checkoutData.etapa === 'destinatario' && (
                  <EntregaStep
                    isAuthenticated={isAuthenticated}
                    dadosDestinatario={checkoutData.dadosDestinatario}
                    setDadosDestinatario={checkoutData.setDadosDestinatario}
                    destinatarioIgualComprador={checkoutData.destinatarioIgualComprador}
                    setDestinatarioIgualComprador={checkoutData.setDestinatarioIgualComprador}
                    dadosEntrega={checkoutData.dadosEntrega}
                    setDadosEntrega={checkoutData.setDadosEntrega}
                    enderecosSalvos={enderecosSalvos}
                    carregandoEnderecos={carregandoEnderecos}
                    enderecoSelecionadoId={checkoutData.enderecoSelecionadoId}
                    salvarEndereco={checkoutData.salvarEndereco}
                    setSalvarEndereco={checkoutData.setSalvarEndereco}
                    onUsarDadosComprador={usarDadosComprador}
                    onSelecionarEndereco={selecionarEndereco}
                    onLimparSelecaoEndereco={limparSelecaoEndereco}
                    onSubmit={handleSubmitEntrega}
                    onVoltar={() => checkoutData.setEtapa('comprador')}
                  />
                )}

                {/* Etapa 3: Pagamento */}
                {checkoutData.etapa === 'pagamento' && (
                  <PagamentoStep
                    dadosPagamento={checkoutData.dadosPagamento}
                    setDadosPagamento={checkoutData.setDadosPagamento}
                    onSubmit={handleSubmitPagamento}
                    onVoltar={() => checkoutData.setEtapa('destinatario')}
                  />
                )}

                {/* Etapa 4: Confirmação */}
                {checkoutData.etapa === 'confirmacao' && (
                  <ConfirmacaoStep
                    dadosComprador={checkoutData.dadosComprador}
                    dadosDestinatario={checkoutData.dadosDestinatario}
                    destinatarioIgualComprador={checkoutData.destinatarioIgualComprador}
                    dadosEntrega={checkoutData.dadosEntrega}
                    dadosPagamento={checkoutData.dadosPagamento}
                    onVoltar={() => checkoutData.setEtapa('pagamento')}
                    onFinalizar={handleFinalizarCompra}
                  />
                )}
              </div>

              {/* Resumo do Pedido */}
              <div className="lg:col-span-1">
                <CheckoutSummary
                  itens={itensCarrinho}
                  subtotal={subtotal}
                  frete={frete}
                  total={total}
                />
              </div>
            </div>
          </motion.div>
        </Container>
      </main>

      <Footer />

      {/* Modal de Título de Endereço */}
      <AddressTitleModal
        isOpen={checkoutData.mostrarModalTitulo}
        titulo={checkoutData.tituloNovoEndereco}
        onChangeTitulo={checkoutData.setTituloNovoEndereco}
        onConfirmar={handleSalvarNovoEndereco}
        onCancelar={() => checkoutData.setMostrarModalTitulo(false)}
      />
    </>
  );
}
