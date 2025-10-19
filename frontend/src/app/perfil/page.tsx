'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuthContext } from '@/context/AuthContext';
import { IMAGES } from '@/config/images';
import { orderService } from '@/services';

type TabType = 'pedidos' | 'dados' | 'enderecos' | 'pagamento' | 'favoritos';

/**
 * Página Perfil do Usuário
 * 
 * Página com abas para gerenciar pedidos, dados pessoais, endereços e formas de pagamento
 * Integrada com backend para exibir dados reais do usuário logado
 */
export default function PerfilPage() {
  // Função para formatar CPF
  function formatCPF(cpf: string = "") {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  // Função para formatar telefone (formato brasileiro comum)
  function formatPhone(phone: string = "") {
    // Remove tudo que não for número
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      // Celular: (99) 99999-9999
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (cleaned.length === 10) {
      // Fixo: (99) 9999-9999
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  }
  const { user, isAuthenticated, isLoading, deleteAccount } = useAuthContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('pedidos');
  const { favoritos, removerDosFavoritos } = useFavorites();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Pedidos do usuário
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidosLoading, setPedidosLoading] = useState(false);

  // Endereços e cartões ainda mockados, mas podem ser integrados depois
  const enderecos: any[] = [];
  const cartoes: any[] = [];
  
  // Protege a página de perfil
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Busca pedidos quando a aba é ativada
  useEffect(() => {
    const fetchPedidos = async () => {
      setPedidosLoading(true);
      try {
        const result = await orderService.getOrders();
        setPedidos(result.data || []);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        setPedidos([]);
      } finally {
        setPedidosLoading(false);
      }
    };
    if (activeTab === 'pedidos' && isAuthenticated) {
      fetchPedidos();
    }
  }, [activeTab, isAuthenticated]);

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    
    const senha = window.prompt('Digite sua senha para confirmar a exclusão da conta:');
    
    if (!senha) {
      alert('Senha não fornecida. Exclusão cancelada.');
      return;
    }

    try {
      await deleteAccount(senha);
      alert('Sua conta foi excluída com sucesso. Você será redirecionado para a página inicial.');
      router.push('/');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao excluir conta';
      alert('Erro ao excluir conta: ' + errorMessage);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const confirmSaveChanges = () => {
    setShowSaveModal(false);
    // Aqui você pode adicionar a lógica para salvar as alterações
    // Por enquanto, apenas mostra uma mensagem de sucesso
    alert('Alterações salvas com sucesso!');
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-primary-white">Carregando...</p>
      </div>
    );
  }

  // Não renderiza nada se não estiver autenticado
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-dark-bg pt-24 pb-16 relative overflow-hidden">
        {/* Imagem de fundo com filtro vintage */}
        <div className="fixed inset-0 z-0">
          <Image
            src={IMAGES.profile}
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Overlay escuro com fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/85 via-dark-bg/90 to-dark-bg/95" />
          {/* Filtro vintage granulado */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuNSIvPjwvc3ZnPg==')]" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary-bronze">
              <span className="font-nsr">Meu Perfil</span>
            </h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-dark-border">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('pedidos')}
                className={`px-6 py-3 text-sm uppercase tracking-wider ${
                  activeTab === 'pedidos'
                    ? 'text-primary-bronze border-b-2 border-primary-bronze'
                    : 'text-primary-white/50 hover:text-primary-white'
                }`}
              >
                Meus Pedidos
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('dados')}
                className={`px-6 py-3 text-sm uppercase tracking-wider ${
                  activeTab === 'dados'
                    ? 'text-primary-bronze border-b-2 border-primary-bronze'
                    : 'text-primary-white/50 hover:text-primary-white'
                }`}
              >
                Dados Pessoais
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('enderecos')}
                className={`px-6 py-3 text-sm uppercase tracking-wider ${
                  activeTab === 'enderecos'
                    ? 'text-primary-bronze border-b-2 border-primary-bronze'
                    : 'text-primary-white/50 hover:text-primary-white'
                }`}
              >
                Endereços
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('pagamento')}
                className={`px-6 py-3 text-sm uppercase tracking-wider ${
                  activeTab === 'pagamento'
                    ? 'text-primary-bronze border-b-2 border-primary-bronze'
                    : 'text-primary-white/50 hover:text-primary-white'
                }`}
              >
                Pagamento
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('favoritos')}
                className={`px-6 py-3 text-sm uppercase tracking-wider ${
                  activeTab === 'favoritos'
                    ? 'text-primary-bronze border-b-2 border-primary-bronze'
                    : 'text-primary-white/50 hover:text-primary-white'
                }`}
              >
                Favoritos
              </Button>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="mt-8">
              {/* Pedidos */}
              {activeTab === 'pedidos' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {pedidosLoading ? (
                    <div className="text-center py-8 text-primary-white/50">Carregando pedidos...</div>
                  ) : pedidos.length === 0 ? (
                    <div className="text-center py-8 text-primary-white/50">Nenhum pedido encontrado.</div>
                  ) : (
                    <div className="space-y-4">
                      {pedidos.map((pedido) => (
                        <div
                          key={pedido.id}
                          className="bg-dark-card border border-dark-border p-6 rounded-sm hover:border-primary-bronze transition-colors"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                              <p className="text-primary-bronze font-semibold text-lg">{pedido.orderNumber || pedido.id}</p>
                              <p className="text-primary-white/50 text-sm mt-1">Data: {new Date(pedido.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-primary-white font-semibold">R$ {pedido.total?.toFixed(2) || '-'}</p>
                              <p className={`text-sm mt-1 ${pedido.status === 'DELIVERED' ? 'text-green-500' : 'text-primary-gold'}`}>
                                {pedido.status}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="mt-4 text-sm text-primary-bronze hover:underline p-0"
                          >
                            Ver detalhes →
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Dados Pessoais */}
              {activeTab === 'dados' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <form className="space-y-4 max-w-2xl" onSubmit={handleSaveChanges}>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="text"
                        placeholder="Nome"
                        defaultValue={user?.name || ''}
                        readOnly
                      />
                      <Input
                        type="text"
                        placeholder="CPF"
                        defaultValue={formatCPF(user?.cpf || '')}
                        readOnly
                      />
                    </div>
                    
                    <Input
                      type="email"
                      placeholder="Email"
                      defaultValue={user?.email || ''}
                      readOnly
                    />
                    
                    <Input
                      type="tel"
                      placeholder="Telefone"
                      defaultValue={formatPhone(user?.phone || '')}
                      readOnly
                    />

                    <div className="pt-4">
                      <h3 className="text-lg font-semibold mb-4 text-primary-white">Alterar Senha</h3>
                      <div className="space-y-3">
                        <Input
                          type="password"
                          placeholder="Senha Atual"
                        />
                        <Input
                          type="password"
                          placeholder="Nova Senha"
                        />
                        <Input
                          type="password"
                          placeholder="Confirmar Nova Senha"
                        />
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      type="submit"
                      className="py-3 px-8"
                    >
                      Salvar Alterações
                    </Button>

                    {/* Link discreto para excluir conta */}
                    <div className="mt-8 pt-4 border-t border-dark-border/30">
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="text-sm text-primary-white/40 hover:text-red-500 transition-colors underline"
                      >
                        Excluir minha conta
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Endereços */}
              {activeTab === 'enderecos' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <Button variant="primary" className="py-2 px-6">
                      + Adicionar Endereço
                    </Button>
                  </div>
                  
                  {enderecos.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-primary-white/50 mb-4">Você ainda não tem endereços cadastrados</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enderecos.map((endereco) => (
                        <div
                          key={endereco.id}
                          className="bg-dark-card border border-dark-border p-6 rounded-sm hover:border-primary-bronze transition-colors relative"
                        >
                          {endereco.principal && (
                            <span className="absolute top-4 right-4 text-xs bg-primary-bronze text-dark-bg px-2 py-1 rounded-sm">
                              Principal
                            </span>
                          )}
                          <h3 className="text-primary-bronze font-semibold mb-3">{endereco.nome}</h3>
                          <p className="text-primary-white/70 text-sm mb-1">{endereco.rua}</p>
                          <p className="text-primary-white/70 text-sm mb-1">{endereco.cidade}</p>
                          <p className="text-primary-white/70 text-sm mb-4">CEP: {endereco.cep}</p>
                          <div className="flex gap-3">
                            <Button variant="ghost" className="text-sm text-primary-bronze hover:underline p-0">
                              Editar
                            </Button>
                            <Button variant="ghost" className="text-sm text-red-500 hover:underline p-0">
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Pagamento */}
              {activeTab === 'pagamento' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <Button variant="primary" className="py-2 px-6">
                      + Adicionar Cartão
                    </Button>
                  </div>
                  {cartoes.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-primary-white/50 mb-4">Você ainda não tem cartões cadastrados</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cartoes.map((cartao) => (
                        <div
                          key={cartao.id}
                          className="bg-dark-card border border-dark-border p-6 rounded-sm hover:border-primary-bronze transition-colors relative"
                        >
                          {cartao.principal && (
                            <span className="absolute top-4 right-4 text-xs bg-primary-bronze text-dark-bg px-2 py-1 rounded-sm">
                              Principal
                            </span>
                          )}
                          <p className="text-primary-white/50 text-xs mb-2">{cartao.bandeira}</p>
                          <p className="text-primary-white font-mono text-lg mb-2">{cartao.numero}</p>
                          <p className="text-primary-white/70 text-sm mb-4">{cartao.nome}</p>
                          <div className="flex gap-3">
                            <Button variant="ghost" className="text-sm text-primary-bronze hover:underline p-0">
                              Editar
                            </Button>
                            <Button variant="ghost" className="text-sm text-red-500 hover:underline p-0">
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Favoritos */}
              {activeTab === 'favoritos' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {favoritos.length === 0 ? (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <Link href="/loja">
                          <Button variant="primary" className="py-2 px-6">
                            Explorar Produtos
                          </Button>
                        </Link>
                      </div>
                      <div className="text-center py-12">
                        <p className="text-primary-white/50 mb-4">Você ainda não tem favoritos</p>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoritos.map((produto) => (
                        <div
                          key={produto.id}
                          className="bg-dark-card border border-dark-border rounded-sm overflow-hidden hover:border-primary-bronze transition-colors group"
                        >
                          <Link href={`/produto/${produto.slug}`}>
                            <div className="relative aspect-[3/4] overflow-hidden">
                              <Image
                                src={produto.images[0]}
                                alt={produto.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                          <div className="p-4">
                            <Link href={`/produto/${produto.slug}`}>
                              <h3 className="font-semibold mb-2 hover:text-primary-gold transition-colors text-primary-white">
                                {produto.name}
                              </h3>
                            </Link>
                            <p className="text-primary-gold font-bold mb-3">
                              R$ {produto.price.toFixed(2)}
                            </p>
                            <div className="flex gap-2">
                              <Link 
                                href={`/produto/${produto.slug}`}
                                className="flex-1 py-2 text-center text-xs border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-primary-black transition-colors rounded-sm uppercase tracking-wider"
                              >
                                Ver Produto
                              </Link>
                              <Button
                                variant="ghost"
                                onClick={() => removerDosFavoritos(produto.id)}
                                className="px-3 py-2 text-xs border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </Container>
      </main>

      <Footer />

      {/* Modal de Confirmação de Salvamento */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-dark-card border-2 border-primary-bronze rounded-sm max-w-md w-full p-8 relative"
          >
            {/* Botão fechar */}
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute top-4 right-4 text-primary-white/50 hover:text-primary-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Título */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-bronze/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-bronze text-center mb-2 font-nsr">
                Confirmar Alterações
              </h3>
              <p className="text-primary-white/60 text-center text-sm">
                Tem certeza que deseja salvar as alterações?
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-3 border border-dark-border text-primary-white hover:bg-dark-bg"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={confirmSaveChanges}
                className="flex-1 py-3"
              >
                Confirmar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-dark-card border-2 border-red-500/50 rounded-sm max-w-md w-full p-8 relative"
          >
            {/* Botão fechar */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-primary-white/50 hover:text-primary-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Título */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-white text-center mb-2">
                Excluir Conta Permanentemente
              </h3>
              <p className="text-primary-white/60 text-center text-sm">
                Esta ação é <span className="text-red-500 font-semibold">irreversível</span>
              </p>
            </div>

            {/* Conteúdo */}
            <div className="mb-8">
              <p className="text-primary-white/70 text-sm mb-4">
                Todos os seus dados serão removidos permanentemente:
              </p>
              <ul className="space-y-2 text-primary-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Histórico de pedidos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Endereços salvos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Favoritos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Avaliações de produtos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Todas as informações pessoais</span>
                </li>
              </ul>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-dark-border text-primary-white hover:bg-dark-bg"
              >
                Cancelar
              </Button>
              <Button
                variant="ghost"
                onClick={handleDeleteAccount}
                className="flex-1 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Confirmar Exclusão
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
