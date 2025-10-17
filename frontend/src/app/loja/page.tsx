'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { IMAGES } from '@/config/images';

/**
 * Loja - Página de Vitrine
 * 
 * Grid de produtos com imagens grandes ocupando a tela.
 * Preço sempre visível, hover mostra segunda imagem e tamanhos para adicionar ao carrinho direto.
 * Experiência visual e rápida de compra.
 */
function LojaContent() {
  const parametrosBusca = useSearchParams();
  const parametroFiltro = parametrosBusca.get('filter');
  const { adicionarAoCarrinho } = useCart();
  
  const [filtro, setFiltro] = useState<'todos' | 'masculino' | 'feminino'>('todos');
  const [idProdutoHover, setIdProdutoHover] = useState<string | null>(null);
  const [adicionadoAoCarrinho, setAdicionadoAoCarrinho] = useState<{ idProduto: string; tamanho: string } | null>(null);
  const [idProdutoClicado, setIdProdutoClicado] = useState<string | null>(null);

  useEffect(() => {
    if (parametroFiltro === 'masculino' || parametroFiltro === 'feminino') {
      setFiltro(parametroFiltro);
    }
  }, [parametroFiltro]);

  // Aplicar filtros
  let produtosFiltrados = products;
  if (filtro !== 'todos') {
    produtosFiltrados = products.filter(p => p.category === filtro);
  }

  const manipularAdicaoAoCarrinho = (idProduto: string, tamanho: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const produto = products.find(p => p.id === idProduto);
    if (produto) {
      adicionarAoCarrinho(produto, tamanho);
      setAdicionadoAoCarrinho({ idProduto, tamanho });
      
      // Remove o feedback visual após 2 segundos
      setTimeout(() => {
        setAdicionadoAoCarrinho(null);
      }, 2000);
    }
  };

  const manipularCliqueMobile = (idProduto: string, e: React.MouseEvent) => {
    // Em mobile, o primeiro clique mostra os detalhes
    if (window.innerWidth < 768) {
      if (idProdutoClicado !== idProduto) {
        e.preventDefault();
        setIdProdutoClicado(idProduto);
      }
      // Se já estiver clicado, deixa navegar
    }
  };

  return (
    <>
      <Header />
      
      <main className="pt-20 min-h-screen relative pb-20">
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

        {/* Grid de Produtos - Imagens grandes */}
        {produtosFiltrados.length > 0 ? (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {produtosFiltrados.map((product, index) => {
              const estaClicado = idProdutoClicado === product.id;
              
              return (
                <Link 
                  key={product.id}
                  href={`/produto/${product.slug}`}
                  onClick={(e) => manipularCliqueMobile(product.id, e)}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group aspect-[3/4] overflow-hidden cursor-pointer"
                    onMouseEnter={() => setIdProdutoHover(product.id)}
                    onMouseLeave={() => setIdProdutoHover(null)}
                  >
                    {/* Imagem Principal */}
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className={`object-cover transition-opacity duration-500 ${
                        (idProdutoHover === product.id || estaClicado) && product.images[1] ? 'opacity-0' : 'opacity-100'
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Segunda Imagem (Hover) */}
                    {product.images[1] && (
                      <Image
                        src={product.images[1]}
                        alt={`${product.name} - ângulo alternativo`}
                        fill
                        className={`object-cover transition-opacity duration-500 ${
                          idProdutoHover === product.id || estaClicado ? 'opacity-100' : 'opacity-0'
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    
                    {/* Overlay com informações no hover ou clique mobile */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-dark-bg/70 via-dark-bg/40 to-transparent transition-opacity duration-500 ${
                      estaClicado ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-4xl text-primary-gold mb-4" style={{ fontFamily: 'Nsr, sans-serif', textShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}>
                          {product.name}
                        </h3>
                        
                        {/* Tamanhos Disponíveis - Minimalista */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          {product.sizes.map((size) => {
                            const foiAdicionado = adicionadoAoCarrinho?.idProduto === product.id && adicionadoAoCarrinho?.tamanho === size;
                            const estaIndisponivel = product.unavailableSizes?.includes(size);
                            
                            return (
                              <motion.button
                                key={size}
                                onClick={(e) => !estaIndisponivel && manipularAdicaoAoCarrinho(product.id, size, e)}
                                disabled={estaIndisponivel}
                                className={`
                                  text-lg uppercase tracking-widest transition-all duration-300
                                  ${estaIndisponivel
                                    ? 'text-primary-gold/30 line-through cursor-not-allowed'
                                    : foiAdicionado 
                                      ? 'text-primary-gold underline underline-offset-4' 
                                      : 'text-primary-gold/80 hover:text-primary-gold'
                                  }
                                `}
                                style={!estaIndisponivel && !foiAdicionado ? { 
                                  fontFamily: 'Nsr, sans-serif',
                                  textShadow: 'none',
                                  transition: 'all 0.3s ease'
                                } : { fontFamily: 'Nsr, sans-serif' }}
                                whileHover={!estaIndisponivel ? { 
                                  scale: 1.1,
                                  textShadow: '0 0 10px rgba(212, 175, 55, 0.6)'
                                } : undefined}
                                whileTap={!estaIndisponivel ? { scale: 0.95 } : undefined}
                              >
                                {size}
                              </motion.button>
                            );
                          })}
                        </div>
                        
                        {/* Botão "Ver detalhes" apenas em mobile */}
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e?.preventDefault();
                            e?.stopPropagation();
                            // No segundo clique, navega para a página
                            if (estaClicado) {
                              window.location.href = `/produto/${product.slug}`;
                            }
                          }}
                          className="md:hidden text-primary-gold/60 hover:text-primary-gold font-nsr py-2"
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>

                    {/* Badge de novidade - Minimalista */}
                    {product.new && (
                      <div className="absolute top-4 left-4 text-primary-gold text-base uppercase tracking-widest z-10" style={{ fontFamily: 'Nsr, sans-serif' }}>
                        Novo
                      </div>
                    )}

                    {/* Preço sempre visível - Simples e discreto */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <p className="text-2xl text-black group-hover:text-primary-gold transition-colors" style={{ fontFamily: 'Nsr, sans-serif'}}>
                        R$ {product.price.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 text-center py-32"
          >
            <p className="text-2xl text-primary-white/30">
              Nenhum produto em destaque nesta categoria.
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function LojaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-primary-gold">Carregando...</p></div>}>
      <LojaContent />
    </Suspense>
  );
}
