'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import { products } from '@/data/products';
import { SlidersHorizontal } from 'lucide-react';

/**
 * Produtos - Página de Catálogo
 * 
 * Catálogo completo com grid de produtos, filtros avançados e ordenação.
 * Layout minimalista com espaçamento generoso e cards navegáveis.
 */
export default function ProdutosPage() {
  const [filtro, setFiltro] = useState<'todos' | 'masculino' | 'feminino'>('todos');
  const [ordenarPor, setOrdenarPor] = useState<'novos' | 'preco-asc' | 'preco-desc'>('novos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Aplicar filtros
  let produtosFiltrados = products;
  if (filtro !== 'todos') {
    produtosFiltrados = products.filter(p => p.category === filtro);
  }

  // Aplicar ordenação
  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    if (ordenarPor === 'preco-asc') return a.price - b.price;
    if (ordenarPor === 'preco-desc') return b.price - a.price;
    return b.new ? 1 : -1; // Novos primeiro
  });

  return (
    <>
      <Header />
      
      <main className="pt-20 pb-12 min-h-screen">
        {/* Layout Full Width com Sidebar Fixa */}
        <div className="flex">
          {/* Sidebar de Filtros - Desktop */}
          <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-dark-border/20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-20 h-[calc(100vh-5rem)] px-8 py-6 flex flex-col justify-center overflow-y-auto"
            >
              <h2 className="text-sm font-bold mb-6 text-primary-gold uppercase tracking-widest">Filtros</h2>

              {/* Categoria */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-semibold mb-3 text-primary-white/50">
                  Categoria
                </h3>
                <div className="space-y-2">
                  {(['todos', 'masculino', 'feminino'] as const).map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="categoria"
                        checked={filtro === cat}
                        onChange={() => setFiltro(cat)}
                        className="w-3.5 h-3.5 text-primary-gold bg-dark-bg border-dark-border focus:ring-primary-gold focus:ring-1"
                      />
                      <span className="ml-2.5 text-xs text-primary-white/70 group-hover:text-primary-gold transition-colors capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tamanhos */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-semibold mb-3 text-primary-white/50">
                  Tamanhos
                </h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {['40', '42', '44', '46', '48', '50', 'UN', 'XXG', 'XXXG', 'P', 'M', 'G', 'GG'].map((size) => (
                    <button
                      key={size}
                      className="px-2 py-1.5 bg-dark-card border border-dark-border text-primary-white/60 hover:text-primary-gold hover:border-primary-gold rounded-sm text-[11px] transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordenação */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-semibold mb-3 text-primary-white/50">
                  Ordenar
                </h3>
                <select
                  value={ordenarPor}
                  onChange={(e) => setOrdenarPor(e.target.value as any)}
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border text-primary-white rounded-sm text-xs focus:outline-none focus:border-primary-gold transition-colors"
                >
                  <option value="novos">Novidades</option>
                  <option value="preco-asc">Menor preço</option>
                  <option value="preco-desc">Maior preço</option>
                </select>
              </div>
            </motion.div>
          </aside>

          {/* Filtros Mobile - Toggle */}
          <div className="lg:hidden w-full px-4">
            <Button
              variant="secondary"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="w-full py-3 px-4 mb-6"
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Filtros
            </Button>

            <AnimatePresence>
              {mostrarFiltros && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-dark-card border border-dark-border p-6 rounded-sm mb-8"
                >
                  {/* Categoria Mobile */}
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-wider font-semibold mb-4 text-primary-gold">
                      Categoria
                    </h3>
                    <div className="flex gap-2">
                      {(['todos', 'masculino', 'feminino'] as const).map((cat) => (
                        <Button
                          key={cat}
                          onClick={() => setFiltro(cat)}
                          variant={filtro === cat ? 'primary' : 'secondary'}
                          className="py-2 px-4 flex-1"
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Ordenação Mobile */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider font-semibold mb-4 text-primary-gold">
                      Ordenar por
                    </h3>
                    <select
                      value={ordenarPor}
                      onChange={(e) => setOrdenarPor(e.target.value as any)}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border text-primary-white rounded-sm text-sm focus:outline-none focus:border-primary-gold transition-colors"
                    >
                      <option value="novos">Novidades</option>
                      <option value="preco-asc">Menor preço</option>
                      <option value="preco-desc">Maior preço</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Conteúdo Principal - Full Width */}
          <div className="flex-1 px-6 lg:px-12 pt-8">
            {/* Grid de Produtos - 3 por linha, cards grandes */}
            {produtosOrdenados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {produtosOrdenados.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-2xl text-primary-white/40">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
