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

// Componentes de Checkout
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import {
  CompradorStep,
  DestinatarioStep,
  PagamentoStep,
  ConfirmacaoStep,
} from '@/components/checkout/steps';
import AddressTitleModal from '@/components/checkout/modals/AddressTitleModal';

// Hooks
import { useCart } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';
import { useCheckoutData } from '@/hooks/checkout/useCheckoutData';
import { useSavedAddresses } from '@/hooks/checkout/useSavedAddresses';

// Services
import { addressService } from '@/services';
import type { SavedAddress } from '@/services';

/**
 * Página de Checkout - REFATORADA
 * Orquestra o fluxo de checkout em 4 etapas
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { itensCarrinho, obterTotalCarrinho, limparCarrinho } = useCart();
  const { user, isAuthenticated, register } = useAuthContext();
  
  // Hooks customizados para gerenciar estados
  const checkoutData = useCheckoutData();
  const { enderecosSalvos, carregandoEnderecos, carregarEnderecos } = useSavedAddresses(isAuthenticated);

  // ========================================
  // EFFECTS
  // ========================================

  // Verificar dados do comprador ao carregar
  useEffect(() => {
    if (user) {
      verificarDadosComprador();
    }
  }, [user]);

  // ========================================
  // FUNÇÕES - COMPRADOR
  // ========================================

  const verificarDadosComprador = () => {
    if (!user) return;

    const faltando: string[] = [];
    
    // Preenche dados existentes
    checkoutData.setDadosComprador({
      nome: user.firstName,
      sobrenome: user.lastName,
      email: user.email,
      telefone: user.phone || '',
      cpf: user.cpf || '',
    });

    // Verifica o que está faltando
    if (!user.phone) faltando.push('telefone');
    if (!user.cpf) faltando.push('cpf');

    checkoutData.setDadosCompradorFaltando(faltando);

    // Se não falta nada, pula direto para destinatário
    if (faltando.length === 0) {
      checkoutData.setEtapa('destinatario');
    }
  };

  const handleSubmitComprador = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se não está logado, deve criar conta (OBRIGATÓRIO)
    if (!user) {
      if (checkoutData.senha !== checkoutData.confirmarSenha) {
        alert('As senhas não coincidem');
        return;
      }

      if (!checkoutData.aceitouTermos) {
        alert('Você deve aceitar os termos de uso e política de privacidade');
        return;
      }

      try {
        // Criar conta com todos os dados necessários
        await register(
          checkoutData.dadosComprador.nome,
          checkoutData.dadosComprador.sobrenome,
          checkoutData.dadosComprador.email,
          checkoutData.senha,
          checkoutData.confirmarSenha,
          checkoutData.dataNascimento,
          {
            privacyPolicy: true,
            terms: checkoutData.aceitouTermos,
            marketing: false,
          }
        );
        
        // Nota: CPF e telefone precisarão ser atualizados após o registro
        // TODO: Implementar atualização de perfil com esses dados adicionais
        
      } catch (error) {
        console.error('Erro ao criar conta:', error);
        alert('Erro ao criar conta. Tente novamente.');
        return;
      }
    }

    // Se está logado e precisa salvar dados faltantes
    if (user && checkoutData.dadosCompradorFaltando.length > 0 && checkoutData.salvarDadosComprador) {
      try {
        // TODO: Criar endpoint para atualizar dados do usuário (phone, cpf)
        console.log('Salvando dados do comprador no perfil...');
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      }
    }

    // Avança para próxima etapa
    checkoutData.setEtapa('destinatario');
  };

  // ========================================
  // FUNÇÕES - DESTINATÁRIO
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
                {/* Etapa 1: Comprador */}
                {checkoutData.etapa === 'comprador' && (
                  <CompradorStep
                    user={user}
                    dadosComprador={checkoutData.dadosComprador}
                    setDadosComprador={checkoutData.setDadosComprador}
                    dadosCompradorFaltando={checkoutData.dadosCompradorFaltando}
                    senha={checkoutData.senha}
                    setSenha={checkoutData.setSenha}
                    confirmarSenha={checkoutData.confirmarSenha}
                    setConfirmarSenha={checkoutData.setConfirmarSenha}
                    dataNascimento={checkoutData.dataNascimento}
                    setDataNascimento={checkoutData.setDataNascimento}
                    aceitouTermos={checkoutData.aceitouTermos}
                    setAceitouTermos={checkoutData.setAceitouTermos}
                    salvarDadosComprador={checkoutData.salvarDadosComprador}
                    setSalvarDadosComprador={checkoutData.setSalvarDadosComprador}
                    onSubmit={handleSubmitComprador}
                  />
                )}

                {/* Etapa 2: Destinatário */}
                {checkoutData.etapa === 'destinatario' && (
                  <DestinatarioStep
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
