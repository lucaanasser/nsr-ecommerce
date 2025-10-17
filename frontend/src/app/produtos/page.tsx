'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import Container from '@/components/ui/Container';
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
      
      <main className="pt-32 pb-20">
        <Container>
          {/* Título e Filtros */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Coleção Completa
              </h1>
              <p className="text-primary-white/60 text-lg mb-8">
                Explore todas as peças da NSR
              </p>

              {/* Barra de Filtros */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                {/* Contador de Produtos */}
                <p className="text-primary-white/60">
                  {produtosOrdenados.length} {produtosOrdenados.length === 1 ? 'produto' : 'produtos'}
                </p>

                {/* Controles */}
                <div className="flex flex-wrap gap-4">
                  {/* Toggle Filtros Mobile */}
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className="md:hidden py-2 px-4"
                  >
                    <SlidersHorizontal size={18} className="mr-2" />
                    Filtros
                  </Button>

                  {/* Filtro de Categoria */}
                  <div className="flex gap-2">
                    {(['todos', 'masculino', 'feminino'] as const).map((cat) => (
                      <Button
                        key={cat}
                        onClick={() => setFiltro(cat)}
                        variant={filtro === cat ? 'primary' : 'secondary'}
                        className="py-2 px-4"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>

                  {/* Ordenação */}
                  <select
                    value={ordenarPor}
                    onChange={(e) => setOrdenarPor(e.target.value as any)}
                    className="px-4 py-2 bg-dark-card border border-dark-border text-primary-white rounded-sm text-sm focus:outline-none focus:border-primary-gold transition-colors"
                  >
                    <option value="novos">Novidades</option>
                    <option value="preco-asc">Menor preço</option>
                    <option value="preco-desc">Maior preço</option>
                  </select>
                </div>
              </div>

              {/* Filtros Expandidos (Mobile) */}
              {mostrarFiltros && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="md:hidden bg-dark-card border border-dark-border p-6 rounded-sm mb-8"
                >
                  <h3 className="text-sm uppercase tracking-wider font-semibold mb-4 text-primary-gold">
                    Filtros
                  </h3>
                  {/* Adicione mais filtros aqui conforme necessário */}
                  <p className="text-sm text-primary-white/60">
                    Mais opções de filtro em breve...
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Grid de Produtos */}
          {produtosOrdenados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
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
        </Container>
      </main>

      <Footer />
    </>
  );
}
