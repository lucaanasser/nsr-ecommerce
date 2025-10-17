'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';
import { CreditCard, Truck, MapPin, ShoppingBag } from 'lucide-react';

/**
 * Página de Checkout
 * 
 * Página de finalização da compra com resumo do pedido,
 * dados de entrega e pagamento
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { itensCarrinho, obterTotalCarrinho, limparCarrinho } = useCart();
  const [etapa, setEtapa] = useState<'entrega' | 'pagamento' | 'confirmacao'>('entrega');

  // Estados do formulário de entrega
  const [dadosEntrega, setDadosEntrega] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  // Estados do formulário de pagamento
  const [dadosPagamento, setDadosPagamento] = useState({
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: '',
  });

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

  const handleSubmitEntrega = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa('pagamento');
  };

  const handleSubmitPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa('confirmacao');
  };

  const handleFinalizarCompra = () => {
    // Aqui você faria a integração com o backend
    limparCarrinho();
    router.push('/');
    alert('Pedido realizado com sucesso!');
  };

  const subtotal = obterTotalCarrinho();
  const frete = subtotal > 299 ? 0 : 29.90;
  const total = subtotal + frete;

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
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary-bronze">
              Finalizar Compra
            </h1>

            {/* Indicador de Etapas */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className={`flex items-center gap-2 ${etapa === 'entrega' ? 'text-primary-bronze' : 'text-primary-white/30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  etapa === 'entrega' ? 'border-primary-bronze bg-primary-bronze/20' : 'border-primary-white/30'
                }`}>
                  1
                </div>
                <span className="hidden md:inline text-sm uppercase tracking-wider">Entrega</span>
              </div>
              
              <div className="w-12 h-0.5 bg-primary-white/30" />
              
              <div className={`flex items-center gap-2 ${etapa === 'pagamento' ? 'text-primary-bronze' : 'text-primary-white/30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  etapa === 'pagamento' ? 'border-primary-bronze bg-primary-bronze/20' : 'border-primary-white/30'
                }`}>
                  2
                </div>
                <span className="hidden md:inline text-sm uppercase tracking-wider">Pagamento</span>
              </div>
              
              <div className="w-12 h-0.5 bg-primary-white/30" />
              
              <div className={`flex items-center gap-2 ${etapa === 'confirmacao' ? 'text-primary-bronze' : 'text-primary-white/30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  etapa === 'confirmacao' ? 'border-primary-bronze bg-primary-bronze/20' : 'border-primary-white/30'
                }`}>
                  3
                </div>
                <span className="hidden md:inline text-sm uppercase tracking-wider">Confirmação</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulário */}
              <div className="lg:col-span-2">
                {/* Etapa 1: Entrega */}
                {etapa === 'entrega' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-dark-card border border-dark-border p-6 rounded-sm"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Truck className="text-primary-bronze" size={24} />
                      <h2 className="text-2xl font-semibold">Dados de Entrega</h2>
                    </div>

                    <form onSubmit={handleSubmitEntrega} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="text"
                          placeholder="Nome"
                          required
                          value={dadosEntrega.nome}
                          onChange={(e) => setDadosEntrega({ ...dadosEntrega, nome: e.target.value })}
                          className="bg-dark-bg/50"
                        />
                        <Input
                          type="text"
                          placeholder="Sobrenome"
                          required
                          value={dadosEntrega.sobrenome}
                          onChange={(e) => setDadosEntrega({ ...dadosEntrega, sobrenome: e.target.value })}
                          className="bg-dark-bg/50"
                        />
                      </div>

                      <Input
                        type="email"
                        placeholder="Email"
                        required
                        value={dadosEntrega.email}
                        onChange={(e) => setDadosEntrega({ ...dadosEntrega, email: e.target.value })}
                        className="bg-dark-bg/50"
                      />

                      <Input
                        type="tel"
                        placeholder="Telefone"
                        required
                        value={dadosEntrega.telefone}
                        onChange={(e) => setDadosEntrega({ ...dadosEntrega, telefone: e.target.value })}
                        className="bg-dark-bg/50"
                      />

                      <div className="border-t border-dark-border pt-4 mt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="text-primary-bronze" size={20} />
                          <h3 className="text-lg font-semibold">Endereço</h3>
                        </div>

                        <div className="space-y-4">
                          <Input
                            type="text"
                            placeholder="CEP"
                            required
                            value={dadosEntrega.cep}
                            onChange={(e) => setDadosEntrega({ ...dadosEntrega, cep: e.target.value })}
                            className="bg-dark-bg/50"
                          />

                          <Input
                            type="text"
                            placeholder="Endereço"
                            required
                            value={dadosEntrega.endereco}
                            onChange={(e) => setDadosEntrega({ ...dadosEntrega, endereco: e.target.value })}
                            className="bg-dark-bg/50"
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              type="text"
                              placeholder="Número"
                              required
                              value={dadosEntrega.numero}
                              onChange={(e) => setDadosEntrega({ ...dadosEntrega, numero: e.target.value })}
                              className="bg-dark-bg/50"
                            />
                            <Input
                              type="text"
                              placeholder="Complemento"
                              value={dadosEntrega.complemento}
                              onChange={(e) => setDadosEntrega({ ...dadosEntrega, complemento: e.target.value })}
                              className="bg-dark-bg/50"
                            />
                          </div>

                          <Input
                            type="text"
                            placeholder="Bairro"
                            required
                            value={dadosEntrega.bairro}
                            onChange={(e) => setDadosEntrega({ ...dadosEntrega, bairro: e.target.value })}
                            className="bg-dark-bg/50"
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              type="text"
                              placeholder="Cidade"
                              required
                              value={dadosEntrega.cidade}
                              onChange={(e) => setDadosEntrega({ ...dadosEntrega, cidade: e.target.value })}
                              className="bg-dark-bg/50"
                            />
                            <Input
                              type="text"
                              placeholder="Estado"
                              required
                              value={dadosEntrega.estado}
                              onChange={(e) => setDadosEntrega({ ...dadosEntrega, estado: e.target.value })}
                              className="bg-dark-bg/50"
                            />
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full mt-6">
                        Continuar para Pagamento
                      </Button>
                    </form>
                  </motion.div>
                )}

                {/* Etapa 2: Pagamento */}
                {etapa === 'pagamento' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-dark-card border border-dark-border p-6 rounded-sm"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="text-primary-bronze" size={24} />
                      <h2 className="text-2xl font-semibold">Dados de Pagamento</h2>
                    </div>

                    <form onSubmit={handleSubmitPagamento} className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Número do Cartão"
                        required
                        value={dadosPagamento.numeroCartao}
                        onChange={(e) => setDadosPagamento({ ...dadosPagamento, numeroCartao: e.target.value })}
                        className="bg-dark-bg/50"
                      />

                      <Input
                        type="text"
                        placeholder="Nome no Cartão"
                        required
                        value={dadosPagamento.nomeCartao}
                        onChange={(e) => setDadosPagamento({ ...dadosPagamento, nomeCartao: e.target.value })}
                        className="bg-dark-bg/50"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="text"
                          placeholder="Validade (MM/AA)"
                          required
                          value={dadosPagamento.validade}
                          onChange={(e) => setDadosPagamento({ ...dadosPagamento, validade: e.target.value })}
                          className="bg-dark-bg/50"
                        />
                        <Input
                          type="text"
                          placeholder="CVV"
                          required
                          value={dadosPagamento.cvv}
                          onChange={(e) => setDadosPagamento({ ...dadosPagamento, cvv: e.target.value })}
                          className="bg-dark-bg/50"
                        />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button
                          variant="secondary"
                          onClick={() => setEtapa('entrega')}
                          className="flex-1"
                        >
                          Voltar
                        </Button>
                        <Button type="submit" className="flex-1">
                          Revisar Pedido
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Etapa 3: Confirmação */}
                {etapa === 'confirmacao' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-dark-card border border-dark-border p-6 rounded-sm"
                  >
                    <h2 className="text-2xl font-semibold mb-6">Confirme seu Pedido</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-primary-bronze">Entrega</h3>
                        <div className="text-sm text-primary-white/70 space-y-1">
                          <p>{dadosEntrega.nome} {dadosEntrega.sobrenome}</p>
                          <p>{dadosEntrega.email}</p>
                          <p>{dadosEntrega.telefone}</p>
                          <p className="mt-2">
                            {dadosEntrega.endereco}, {dadosEntrega.numero}
                            {dadosEntrega.complemento && ` - ${dadosEntrega.complemento}`}
                          </p>
                          <p>{dadosEntrega.bairro}</p>
                          <p>{dadosEntrega.cidade} - {dadosEntrega.estado}</p>
                          <p>CEP: {dadosEntrega.cep}</p>
                        </div>
                      </div>

                      <div className="border-t border-dark-border pt-4">
                        <h3 className="text-lg font-semibold mb-3 text-primary-bronze">Pagamento</h3>
                        <div className="text-sm text-primary-white/70">
                          <p>Cartão terminado em {dadosPagamento.numeroCartao.slice(-4)}</p>
                          <p>{dadosPagamento.nomeCartao}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button
                          variant="secondary"
                          onClick={() => setEtapa('pagamento')}
                          className="flex-1"
                        >
                          Voltar
                        </Button>
                        <Button
                          onClick={handleFinalizarCompra}
                          className="flex-1"
                        >
                          Finalizar Compra
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Resumo do Pedido */}
              <div className="lg:col-span-1">
                <div className="bg-dark-card border border-dark-border p-6 rounded-sm sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

                  <div className="space-y-4 mb-6">
                    {itensCarrinho.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                        <div className="relative w-16 h-20 flex-shrink-0">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover rounded-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-primary-white/50">
                            Tamanho: {item.selectedSize} | Cor: {item.selectedColor}
                          </p>
                          <p className="text-xs text-primary-white/50">Qtd: {item.quantity}</p>
                          <p className="text-sm text-primary-gold mt-1">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dark-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-white/70">Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-white/70">Frete</span>
                      <span className={frete === 0 ? 'text-green-500' : ''}>
                        {frete === 0 ? 'Grátis' : `R$ ${frete.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-border">
                      <span>Total</span>
                      <span className="text-primary-bronze">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
