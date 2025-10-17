'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { Check, Heart, Share2, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

/**
 * Página de Detalhes do Produto
 * 
 * Página de detalhes completos do produto com galeria, descrição,
 * seleção de tamanho/cor e botão de adicionar ao carrinho.
 */
export default function PaginaDetalhesProduto() {
  const parametros = useParams();
  const slug = parametros?.slug as string;
  const router = useRouter();
  const { adicionarAoCarrinho } = useCart();
  const { adicionarAosFavoritos, estaNosFavoritos } = useFavorites();
  
  const produto = products.find(p => p.slug === slug);
  const [imagemSelecionada, setImagemSelecionada] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const estaFavoritado = produto ? estaNosFavoritos(produto.id) : false;

  if (!produto) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-20 min-h-screen relative">
          {/* Background com banner repetido */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'url(/images/nasser.jpg)',
                backgroundRepeat: 'repeat',
                backgroundSize: 'auto 200px',
                backgroundPosition: 'center',
              }}
            />
          </div>

          <Container className="relative z-10">
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-4">Produto não encontrado</h1>
              <p className="text-primary-white/60">
                O produto que você está procurando não existe.
              </p>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const produtosRelacionados = products
    .filter(p => p.collection === produto.collection && p.id !== produto.id)
    .slice(0, 4);

  const manipularAdicaoAoCarrinho = () => {
    if (!tamanhoSelecionado) {
      alert('Por favor, selecione um tamanho');
      return;
    }
    if (!corSelecionada) {
      alert('Por favor, selecione uma cor');
      return;
    }
    
    // Adiciona ao carrinho
    for (let i = 0; i < quantidade; i++) {
      adicionarAoCarrinho(produto, tamanhoSelecionado, corSelecionada);
    }
    
    alert('Produto adicionado ao carrinho!');
  };

  const manipularCompraImediata = () => {
    if (!tamanhoSelecionado) {
      alert('Por favor, selecione um tamanho');
      return;
    }
    if (!corSelecionada) {
      alert('Por favor, selecione uma cor');
      return;
    }
    
    // Adiciona ao carrinho
    for (let i = 0; i < quantidade; i++) {
      adicionarAoCarrinho(produto, tamanhoSelecionado, corSelecionada);
    }
    
    // Redireciona para a página de checkout
    router.push('/checkout');
  };

  const proximaImagem = () => {
    setImagemSelecionada((prev) => (prev + 1) % produto!.images.length);
  };

  const imagemAnterior = () => {
    setImagemSelecionada((prev) => (prev - 1 + produto!.images.length) % produto!.images.length);
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        imagemAnterior();
      } else if (e.key === 'ArrowRight') {
        proximaImagem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [produto]);

  // Navegação por scroll do mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      proximaImagem();
    } else if (e.deltaY < 0) {
      imagemAnterior();
    }
  };

  return (
    <>
      <Header />
      
      <main className="pt-32 pb-20 relative min-h-screen">
        {/* Background com banner repetido */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url(/images/pattern.png)',
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto 350px',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Galeria de Imagens */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Imagem Principal */}
              <div 
                className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm bg-dark-card group"
                onWheel={handleWheel}
              >
                <Image
                  src={produto.images[imagemSelecionada]}
                  alt={produto.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Setas de navegação */}
                {produto.images.length > 1 && (
                  <>
                    <button
                      onClick={imagemAnterior}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark-bg/80 backdrop-blur-sm border border-dark-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-bg hover:border-primary-gold"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft size={20} className="text-primary-white" />
                    </button>
                    <button
                      onClick={proximaImagem}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark-bg/80 backdrop-blur-sm border border-dark-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-bg hover:border-primary-gold"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight size={20} className="text-primary-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {produto.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setImagemSelecionada(index)}
                    className={`relative aspect-square overflow-hidden rounded-sm border-2 transition-all ${
                      imagemSelecionada === index
                        ? 'border-primary-gold'
                        : 'border-dark-border hover:border-primary-gold/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${produto.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Informações do Produto */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Badge e Coleção */}
              <div className="flex items-center gap-3">
                {produto.new && (
                  <span className="bg-primary-gold text-primary-black text-xs px-3 py-1 uppercase tracking-wider font-semibold">
                    Novo
                  </span>
                )}
                <span className="text-sm text-primary-gold/70 uppercase tracking-wider">
                  {produto.collection}
                </span>
              </div>

              {/* Nome e Preço */}
              <div>
                <h1 className="text-3xl md:text-[2.75rem] font-nsr font-bold mb-3 leading-tight">
                  {produto.name}
                </h1>
                <p className="text-2xl md:text-3xl font-nsr font-bold text-gradient">
                  R$ {produto.price.toFixed(2)}
                </p>
              </div>

              {/* Descrição */}
              <p className="text-sm text-primary-white/70 leading-relaxed">
                {produto.description}
              </p>

              <div className="border-t border-dark-border pt-4 space-y-4">
                {/* Seleção de Cor */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold mb-2">
                    Cor: {corSelecionada && <span className="text-primary-gold">{corSelecionada}</span>}
                  </label>
                  <div className="flex gap-2">
                    {produto.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCorSelecionada(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          corSelecionada === color
                            ? 'border-primary-gold scale-110'
                            : 'border-dark-border hover:border-primary-gold/50'
                        }`}
                        style={{
                          backgroundColor: 
                            color === 'Preto' ? '#0A0A0A' : 
                            color === 'Branco' ? '#FAFAFA' : 
                            color === 'Bege' ? '#E8DCC4' : 
                            color === 'Dourado' ? '#C9A96E' : 
                            color === 'Verde Oliva' ? '#556B2F' :
                            color === 'Verde' ? '#228B22' :
                            color === 'Cinza' ? '#6B7280' :
                            color === 'Azul Claro' ? '#87CEEB' :
                            color === 'Terracota' ? '#E2725B' : '#6B7280'
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Seleção de Tamanho */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold mb-2">
                    Tamanho
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {produto.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setTamanhoSelecionado(size)}
                        className={`py-2 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                          tamanhoSelecionado === size
                            ? 'bg-primary-gold text-primary-black'
                            : 'border border-dark-border text-primary-white/70 hover:border-primary-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantidade */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold mb-2">
                    Quantidade
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      className="w-8 h-8 border border-dark-border rounded-sm hover:border-primary-gold transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="text-base font-medium w-10 text-center">{quantidade}</span>
                    <button
                      onClick={() => setQuantidade(quantidade + 1)}
                      className="w-8 h-8 border border-dark-border rounded-sm hover:border-primary-gold transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-2 pt-2">
                  <Button
                    variant="primary"
                    onClick={manipularCompraImediata}
                    className="w-full py-2.5"
                  >
                    Comprar Agora
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={manipularAdicaoAoCarrinho}
                    className="w-full py-2.5"
                  >
                    Adicionar ao Carrinho
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => produto && adicionarAosFavoritos(produto)}
                      className={`flex items-center justify-center gap-2 py-2.5 border rounded-sm transition-colors ${
                        estaFavoritado 
                          ? 'border-primary-gold bg-primary-gold/10 text-primary-gold' 
                          : 'border-dark-border hover:border-primary-gold'
                      }`}
                    >
                      <Heart size={16} fill={estaFavoritado ? 'currentColor' : 'none'} />
                      <span className="text-xs">{estaFavoritado ? 'Favoritado' : 'Favoritar'}</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 border border-dark-border rounded-sm hover:border-primary-gold transition-colors">
                      <Share2 size={16} />
                      <span className="text-xs">Compartilhar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Especificações */}
              <div className="border-t border-dark-border pt-4">
                <h3 className="text-lg font-semibold mb-3 text-primary-bronze">Especificações</h3>
                <div className="space-y-2 text-sm text-primary-white/70">
                  <div className="flex justify-between">
                    <span>Gramatura:</span>
                    <span className="text-primary-white">220g/m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Composição:</span>
                    <span className="text-primary-white">100% Algodão</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modelo:</span>
                    <span className="text-primary-white">1,80m veste M</span>
                  </div>
                  <button className="text-primary-gold hover:underline text-xs mt-2">
                    Ver tabela de medidas →
                  </button>
                </div>
              </div>

              {/* Benefícios */}
              <div className="border-t border-dark-border pt-4 space-y-2.5">
                {[
                  { icon: Truck, text: 'Frete grátis acima de R$ 299' },
                  { icon: Shield, text: 'Compra 100% segura' },
                  { icon: RefreshCw, text: 'Troca grátis em até 30 dias' },
                ].map(({ icon: Icon, text }, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-primary-white/70">
                    <Icon size={16} className="text-primary-gold" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Produtos Relacionados */}
          {produtosRelacionados.length > 0 && (
            <section className="pt-12 border-t border-dark-border">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">Da mesma coleção</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {produtosRelacionados.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              </motion.div>
            </section>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
