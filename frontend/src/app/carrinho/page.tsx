'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, CreditCard, Lock, FileText } from 'lucide-react';
import ShoppingBasketIcon from '@/components/icons/ShoppingBasketIcon';
import { IMAGES } from '@/config/images';

/**
 * Página do Carrinho de Compras
 * 
 * Exibe lista de produtos no carrinho, controles de quantidade,
 * cálculo de frete e total. Design limpo e funcional.
 */
export default function PaginaCarrinho() {
  const { itensCarrinho, atualizarQuantidade, removerDoCarrinho, obterTotalCarrinho } = useCart();

  const subtotal = obterTotalCarrinho();
  const frete = subtotal > 299 ? 0 : 29.90;
  const total = subtotal + frete;

  return (
    <>
      <Header />
      
      <main className="pt-32 pb-20 min-h-screen relative">
        {/* Background com imagem, fade escuro e filtro vintage/granulado */}
        <div className="fixed inset-0 z-0">
          <Image
            src={IMAGES.backgroundCarrinho}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay escuro com fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/90 via-dark-bg/85 to-dark-bg/90" />
          {/* Filtro vintage e granulado - Intenso */}
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'4.5\' numOctaves=\'6\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
              mixBlendMode: 'overlay',
              opacity: 0.6
            }}
          />
          {/* Filtro sepia para efeito vintage */}
          <div className="absolute inset-0 bg-primary-bronze/10 mix-blend-multiply" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-7xl md:text-5xl font-bold mb-12 text-primary-bronze font-nsr">
              Carrinho 
            </h1>

            {itensCarrinho.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Lista de Produtos com scroll */}
                <div className="lg:col-span-2 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary-gold/30 scrollbar-track-dark-border/20">
                  {itensCarrinho.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="flex gap-6 p-6">
                        {/* Imagem do Produto */}
                        <Link href={`/produto/${item.slug}`} className="flex-shrink-0">
                          <div className="relative w-32 h-40 rounded-sm overflow-hidden">
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>

                        {/* Informações */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link
                              href={`/produto/${item.slug}`}
                              className="text-xl font-medium hover:text-primary-gold transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-primary-white/60 mt-1">
                              {item.collection}
                            </p>
                            <div className="flex gap-4 mt-3 text-sm">
                              <span className="text-primary-white/60">
                                Tamanho: <span className="text-primary-white">{item.selectedSize}</span>
                              </span>
                              <span className="text-primary-white/60">
                                Cor: <span className="text-primary-white">{item.selectedColor}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Controle de Quantidade */}
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                onClick={() => atualizarQuantidade(item.id, item.selectedSize, -1)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="text-lg font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                onClick={() => atualizarQuantidade(item.id, item.selectedSize, 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus size={16} />
                              </Button>
                            </div>

                            {/* Preço e Remover */}
                            <div className="flex items-center gap-6">
                              <p className="text-xl font-bold text-gradient">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </p>
                              <Button
                                variant="ghost"
                                onClick={() => removerDoCarrinho(item.id, item.selectedSize)}
                                className="text-primary-white/40 hover:text-red-500 p-2"
                                aria-label="Remover item"
                              >
                                <Trash2 size={20} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Resumo do Pedido */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-1"
                >
                  <Card className="p-8 sticky top-32">
                    <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-primary-white/70">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-primary-white/70">
                        <span>Frete</span>
                        <span>
                          {frete === 0 ? (
                            <span className="text-primary-gold">Grátis</span>
                          ) : (
                            `R$ ${frete.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      {subtotal < 299 && (
                        <p className="text-xs text-primary-gold/70">
                          Falta R$ {(299 - subtotal).toFixed(2)} para frete grátis
                        </p>
                      )}
                    </div>

                    <div className="border-t border-dark-border pt-4 mb-6">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-gradient">R$ {total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button variant="primary" className="w-full mb-3">
                      Finalizar Compra
                    </Button>
                    <Link href="/produtos">
                      <Button variant="secondary" className="w-full">
                        Continuar Comprando
                      </Button>
                    </Link>

                    {/* Métodos de Pagamento */}
                    <div className="mt-6 pt-6 border-t border-dark-border">
                      <p className="text-xs text-primary-white/60 text-center mb-3">
                        Aceitamos:
                      </p>
                      <div className="flex justify-center gap-4 opacity-80">
                        <div className="flex items-center gap-1 text-xs">
                          <CreditCard size={14} className="text-primary-gold" />
                          <span>Cartão</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Lock size={14} className="text-primary-gold" />
                          <span>Pix</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <FileText size={14} className="text-primary-gold" />
                          <span>Boleto</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            ) : (
              // Carrinho Vazio
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Card className="inline-block p-6 mb-6">
                  <ShoppingBasketIcon size={48} className="text-primary-gold" />
                </Card>
                <h2 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h2>
                <p className="text-primary-white/60 mb-8">
                  Adicione produtos incríveis da NSR ao seu carrinho
                </p>
                <Link href="/produtos">
                  <Button variant="primary">
                    Explorar Produtos
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
