'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Product } from '@/data/products';

/**
 * Componente ProductCard
 * 
 * Card de produto com imagem, nome e preço sempre visíveis.
 * No hover: mostra segunda imagem e informações detalhadas.
 */
interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [estaEmHover, setEstaEmHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/produto/${product.slug}`}>
        <div 
          className="card-product group cursor-pointer"
          onMouseEnter={() => setEstaEmHover(true)}
          onMouseLeave={() => setEstaEmHover(false)}
        >
          {/* Imagem do Produto */}
          <div className="relative aspect-[3/4] overflow-hidden bg-dark-bg">
            {/* Imagem Principal */}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ${
                estaEmHover && product.images[1] ? 'opacity-0' : 'opacity-100'
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
                  estaEmHover ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            
            {/* Badge de Novidade - Minimalista */}
            {product.new && (
              <div className="absolute top-4 left-4 text-primary-gold text-base font-nsr uppercase tracking-widest z-10">
                Novo
              </div>
            )}

            {/* Overlay no Hover com Informações Detalhadas - Minimalista */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/70 via-dark-bg/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-8 px-6 z-10">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-nsr text-primary-gold" style={{ textShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}>
                  {product.name}
                </h3>
                
                {/* Tamanhos Disponíveis - Minimalista */}
                <div className="flex flex-wrap justify-center gap-3">
                  {product.sizes.map((size) => {
                    const isUnavailable = product.unavailableSizes?.includes(size);
                    
                    return (
                      <span
                        key={size}
                        className={`text-base font-nsr uppercase tracking-widest transition-all duration-300 ${
                          isUnavailable 
                            ? 'text-primary-gold/30 line-through cursor-not-allowed' 
                            : 'text-primary-gold/80 hover:text-primary-gold hover:scale-110'
                        }`}
                        style={!isUnavailable ? {
                          display: 'inline-block',
                          textShadow: 'none',
                          transition: 'all 0.3s ease'
                        } : undefined}
                        onMouseEnter={(e) => {
                          if (!isUnavailable) {
                            e.currentTarget.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.6)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isUnavailable) {
                            e.currentTarget.style.textShadow = 'none';
                          }
                        }}
                      >
                        {size}
                      </span>
                    );
                  })}
                </div>

                <span className="text-primary-gold/60 text-base font-nsr uppercase tracking-widest inline-block mt-2 hover:text-primary-gold transition-colors">
                  Ver Detalhes
                </span>
              </div>
            </div>
          </div>

          {/* Informações do Produto - Sempre Visíveis */}
          <div className="p-6 space-y-2">
            {/* Nome do Produto */}
            <h3 className="text-xl font-nsr uppercase tracking-wider text-primary-gold">
              {product.name}
            </h3>
            {/* Preço sempre visível e em destaque */}
            <p className="text-2xl font-nsr text-primary-gold group-hover:text-primary-gold transition-colors" style={{ textShadow: estaEmHover ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none' }}>
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
