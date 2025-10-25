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
import { Check, Heart, Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { IMAGES } from '@/config/images';
import ImageZoomModal from '@/components/product/ImageZoomModal';

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
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [zoomModalAberto, setZoomModalAberto] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

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
                backgroundImage: `url(${IMAGES.nasser})`,
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

  return (
    <>
      <Header />
      
      <main className="pt-32 pb-20 relative min-h-screen">
        {/* Background com banner repetido */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${IMAGES.pattern1})`,
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto 350px',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <Container className="relative z-10 !max-w-[1800px] !px-6 lg:!px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_2fr_1.3fr] gap-6 lg:gap-10 xl:gap-16 mb-20">
            {/* Informações do Produto - Lado Esquerdo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 lg:order-1 lg:sticky lg:top-32 lg:self-start"
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
                <h1 className="text-2xl md:text-3xl font-nsr font-bold mb-3 leading-tight">
                  {produto.name}
                </h1>
                <p className="text-xl md:text-2xl font-nsr font-bold text-gradient">
                  R$ {produto.price.toFixed(2)}
                </p>
              </div>

              {/* Descrição */}
              <p className="text-sm text-primary-white/70 leading-relaxed">
                {produto.description}
              </p>

              {/* Navegação de Imagens */}
              {produto.images.length > 1 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-primary-white/60">
                    <span className="text-primary-gold font-semibold">
                      {produto.images.length}
                    </span>
                    <span>imagens</span>
                  </div>
                  <div className="flex gap-2">
                    {produto.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const element = document.getElementById(`image-${index}`);
                          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="relative w-16 h-16 overflow-hidden rounded-sm border-2 transition-all border-dark-border hover:border-primary-gold/50"
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
                </div>
              )}

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
            </motion.div>

            {/* Galeria de Imagens - Centro (Empilhadas Verticalmente) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:order-2"
            >
              {produto.images.map((image, index) => (
                <div
                  key={index}
                  id={`image-${index}`}
                  className="relative aspect-[7/9] overflow-hidden rounded-sm bg-dark-card cursor-pointer"
                  onClick={() => {
                    setImagemSelecionada(index);
                    setZoomModalAberto(true);
                  }}
                >
                  <Image
                    src={image}
                    alt={`${produto.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </motion.div>

            {/* Opções de Compra - Lado Direito */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 lg:order-3 lg:sticky lg:top-32 lg:self-start"
            >
              {/* Seleção de Cor */}
              <div>
                <p className="text-sm text-primary-white/60 mb-3">
                  {corSelecionada || 'Cor'}
                </p>
                <div className="flex gap-3">
                  {produto.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCorSelecionada(color)}
                      className={`w-12 h-12 rounded-full transition-all ${
                        corSelecionada === color
                          ? 'ring-2 ring-primary-bronze ring-offset-2 ring-offset-dark-bg'
                          : 'opacity-60 hover:opacity-100'
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
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>

              {/* Seleção de Tamanho */}
              <div>
                <p className="text-sm text-primary-white/60 mb-3">
                  {tamanhoSelecionado || 'Tamanho'}
                </p>
                <div className="flex gap-2">
                  {produto.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setTamanhoSelecionado(size)}
                      className={`flex-1 py-3 text-sm transition-all ${
                        tamanhoSelecionado === size
                          ? 'bg-primary-bronze text-primary-black font-medium'
                          : 'text-primary-white/70 hover:text-primary-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantidade */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary-white/60">Quantidade</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                    className="w-8 h-8 flex items-center justify-center text-primary-white/70 hover:text-primary-white transition-colors"
                  >
                    −
                  </button>
                  <span className="text-base font-medium w-8 text-center">{quantidade}</span>
                  <button
                    onClick={() => setQuantidade(quantidade + 1)}
                    className="w-8 h-8 flex items-center justify-center text-primary-white/70 hover:text-primary-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3 pt-4">
                <Button
                  variant="primary"
                  onClick={manipularCompraImediata}
                  className="w-full py-3.5 text-sm font-medium"
                >
                  Comprar
                </Button>
                
                <button
                  onClick={manipularAdicaoAoCarrinho}
                  className="w-full py-3.5 text-sm font-medium text-primary-white/80 hover:text-primary-white transition-colors"
                >
                  Adicionar ao carrinho
                </button>
              </div>

              {/* Ações Secundárias */}
              <div className="flex items-center justify-between pt-6">
                <button
                  onClick={() => produto && adicionarAosFavoritos(produto)}
                  className="text-xs text-primary-white/50 hover:text-primary-white transition-colors"
                >
                  <Heart size={20} fill={estaFavoritado ? 'currentColor' : 'none'} className="inline mr-1.5 text-primary-gold" />
                  {estaFavoritado ? 'Salvo' : 'Salvar'}
                </button>
                <button className="text-xs text-primary-white/50 hover:text-primary-white transition-colors">
                  <Share2 size={20} className="inline mr-1.5 text-primary-gold" />
                  Compartilhar
                </button>
              </div>

              {/* Benefícios */}
              <div className="pt-6 space-y-2.5">
                {[
                  { icon: Truck, text: 'Frete grátis acima de R$ 299' },
                  { icon: Shield, text: 'Compra 100% segura' },
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

      {/* Modal de Zoom */}
      <ImageZoomModal
        images={produto.images}
        currentIndex={imagemSelecionada}
        isOpen={zoomModalAberto}
        onClose={() => setZoomModalAberto(false)}
        productName={produto.name}
      />

      <Footer />
    </>
  );
}
