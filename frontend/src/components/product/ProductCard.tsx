'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';

/**
 * Componente ProductCard
 * 
 * Card de produto estilo New In:
 * - Preço visível no canto inferior direito
 * - No hover: segunda imagem, título e tamanhos para adicionar ao carrinho
 */
interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [estaEmHover, setEstaEmHover] = useState(false);
  const [idProdutoClicado, setIdProdutoClicado] = useState(false);
  const [adicionadoAoCarrinho, setAdicionadoAoCarrinho] = useState<string | null>(null);
  const { adicionarAoCarrinho } = useCart();

  const manipularAdicaoAoCarrinho = (tamanho: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    adicionarAoCarrinho(product, tamanho);
    setAdicionadoAoCarrinho(tamanho);
    
    // Remove o feedback visual após 2 segundos
    setTimeout(() => {
      setAdicionadoAoCarrinho(null);
    }, 2000);
  };

  const manipularCliqueMobile = (e: React.MouseEvent) => {
    // Em mobile, o primeiro clique mostra os detalhes
    if (window.innerWidth < 768) {
      if (!idProdutoClicado) {
        e.preventDefault();
        setIdProdutoClicado(true);
      }
      // Se já estiver clicado, deixa navegar
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        href={`/produto/${product.slug}`}
        onClick={manipularCliqueMobile}
      >
        <div 
          className="relative group aspect-[3/4] overflow-hidden cursor-pointer"
          onMouseEnter={() => setEstaEmHover(true)}
          onMouseLeave={() => setEstaEmHover(false)}
        >
          {/* Imagem Principal */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-500 ${
              (estaEmHover || idProdutoClicado) && product.images[1] ? 'opacity-0' : 'opacity-100'
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
                estaEmHover || idProdutoClicado ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          
          {/* Overlay com informações no hover ou clique mobile */}
          <div className={`absolute inset-0 bg-gradient-to-t from-dark-bg/70 via-dark-bg/40 to-transparent transition-opacity duration-500 ${
            idProdutoClicado ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-4xl text-primary-gold mb-4 font-nsr" style={{ textShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}>
                {product.name}
              </h3>
              
              {/* Tamanhos Disponíveis - Minimalista */}
              <div className="flex flex-wrap gap-3 mb-4">
                {product.sizes.map((size) => {
                  const foiAdicionado = adicionadoAoCarrinho === size;
                  const estaIndisponivel = product.unavailableSizes?.includes(size);
                  
                  return (
                    <motion.button
                      key={size}
                      onClick={(e) => !estaIndisponivel && manipularAdicaoAoCarrinho(size, e)}
                      disabled={estaIndisponivel}
                      className={`
                        text-lg uppercase tracking-widest transition-all duration-300 font-nsr
                        ${estaIndisponivel
                          ? 'text-primary-gold/30 line-through cursor-not-allowed'
                          : foiAdicionado 
                            ? 'text-primary-gold underline underline-offset-4' 
                            : 'text-primary-gold/80 hover:text-primary-gold'
                        }
                      `}
                      style={!estaIndisponivel && !foiAdicionado ? { 
                        textShadow: 'none',
                        transition: 'all 0.3s ease'
                      } : undefined}
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
                  if (idProdutoClicado) {
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
            <div className="absolute top-4 left-4 text-primary-gold text-base uppercase tracking-widest z-10 font-nsr">
              Novo
            </div>
          )}

          {/* Preço sempre visível - Simples e discreto */}
          <div className="absolute bottom-4 right-4 z-10">
            <p className="text-2xl text-black group-hover:text-primary-gold transition-colors font-nsr">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
