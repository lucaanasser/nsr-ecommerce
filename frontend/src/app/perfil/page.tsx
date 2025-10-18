'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useFavorites } from '@/context/FavoritesContext';
import { IMAGES } from '@/config/images';

type TabType = 'pedidos' | 'dados' | 'enderecos' | 'pagamento' | 'favoritos';

/**
 * Página Perfil do Usuário
 * 
 * Página com abas para gerenciar pedidos, dados pessoais, endereços e formas de pagamento
 */
export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pedidos');
  const { favoritos, removerDosFavoritos } = useFavorites();

  // Dados mockados
  const pedidos = [
    { id: '#12345', data: '15/10/2025', status: 'Em trânsito', total: 'R$ 450,00' },
    { id: '#12344', data: '10/10/2025', status: 'Entregue', total: 'R$ 320,00' },
    { id: '#12343', data: '05/10/2025', status: 'Entregue', total: 'R$ 890,00' },
  ];

  const enderecos = [
    { id: 1, nome: 'Casa', rua: 'Rua das Flores, 123', cidade: 'São Paulo - SP', cep: '01234-567', principal: true },
    { id: 2, nome: 'Trabalho', rua: 'Av. Paulista, 1000', cidade: 'São Paulo - SP', cep: '01310-100', principal: false },
  ];

  const cartoes = [
    { id: 1, numero: '**** **** **** 1234', bandeira: 'Visa', nome: 'João Silva', principal: true },
    { id: 2, numero: '**** **** **** 5678', bandeira: 'Mastercard', nome: 'João Silva', principal: false },
  ];

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
              Meu Perfil
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
                  <h2 className="text-2xl font-semibold mb-6 text-primary-white">Meus Pedidos</h2>
                  <div className="space-y-4">
                    {pedidos.map((pedido) => (
                      <div
                        key={pedido.id}
                        className="bg-dark-card border border-dark-border p-6 rounded-sm hover:border-primary-bronze transition-colors"
                      >
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div>
                            <p className="text-primary-bronze font-semibold text-lg">{pedido.id}</p>
                            <p className="text-primary-white/50 text-sm mt-1">Data: {pedido.data}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-primary-white font-semibold">{pedido.total}</p>
                            <p className={`text-sm mt-1 ${
                              pedido.status === 'Entregue' ? 'text-green-500' : 'text-primary-gold'
                            }`}>
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
                </motion.div>
              )}

              {/* Dados Pessoais */}
              {activeTab === 'dados' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-primary-white">Dados Pessoais</h2>
                  <form className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="text"
                        placeholder="Nome"
                        defaultValue="João"
                      />
                      
                      <Input
                        type="text"
                        placeholder="Sobrenome"
                        defaultValue="Silva"
                      />
                    </div>
                    
                    <Input
                      type="email"
                      placeholder="Email"
                      defaultValue="joao@email.com"
                    />
                    
                    <Input
                      type="tel"
                      placeholder="Telefone"
                      defaultValue="+55 11 98765-4321"
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        className="w-full bg-dark-card/50 border border-dark-border px-4 py-3 text-primary-white focus:outline-none focus:border-primary-gold transition-colors rounded-sm appearance-none cursor-pointer"
                      >
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                        <option value="nao-informar">Prefiro não informar</option>
                      </select>
                      
                      <Input
                        type="date"
                        defaultValue="1990-01-01"
                      />
                    </div>

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
                    <h2 className="text-2xl font-semibold text-primary-white">Meus Endereços</h2>
                    <Button variant="primary" className="py-2 px-6">
                      + Adicionar Endereço
                    </Button>
                  </div>
                  
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
                    <h2 className="text-2xl font-semibold text-primary-white">Formas de Pagamento</h2>
                    <Button variant="primary" className="py-2 px-6">
                      + Adicionar Cartão
                    </Button>
                  </div>
                  
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
                </motion.div>
              )}

              {/* Favoritos */}
              {activeTab === 'favoritos' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-primary-white">Meus Favoritos</h2>
                  
                  {favoritos.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-primary-white/50 mb-4">Você ainda não tem favoritos</p>
                      <Link href="/loja" className="btn-primary py-2 px-6 inline-block">
                        Explorar Produtos
                      </Link>
                    </div>
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
                              <h3 className="font-semibold mb-2 hover:text-primary-gold transition-colors">
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
    </>
  );
}
