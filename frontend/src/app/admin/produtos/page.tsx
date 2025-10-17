'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { products } from '@/data/products';
import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Página de Gestão de Produtos
 * Listagem, busca, filtros e ações de CRUD (mockado)
 */
export default function AdminProdutos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'masculino' | 'feminino'>('todos');

  // Filtra produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'todos' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-white mb-2">Produtos</h1>
          <p className="text-primary-white/60">Gerencie o catálogo de produtos</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2">
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/40" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-dark-bg/50 border border-dark-border rounded-sm pl-10 pr-4 py-2 text-sm text-primary-white placeholder:text-primary-white/40 focus:outline-none focus:border-primary-gold transition-colors"
            />
          </div>

          {/* Filtro de Categoria */}
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter('todos')}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                categoryFilter === 'todos'
                  ? 'bg-primary-gold text-dark-bg'
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setCategoryFilter('masculino')}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                categoryFilter === 'masculino'
                  ? 'bg-primary-gold text-dark-bg'
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Masculino
            </button>
            <button
              onClick={() => setCategoryFilter('feminino')}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                categoryFilter === 'feminino'
                  ? 'bg-primary-gold text-dark-bg'
                  : 'bg-dark-bg/50 text-primary-white/60 hover:text-primary-white border border-dark-border'
              }`}
            >
              Feminino
            </button>
          </div>
        </div>

        {/* Contador */}
        <div className="mt-3 text-sm text-primary-white/50">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabela de Produtos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg/50">
              <tr className="border-b border-dark-border">
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Produto</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Categoria</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Coleção</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Preço</th>
                <th className="text-center text-sm font-medium text-primary-white/60 p-4">Status</th>
                <th className="text-right text-sm font-medium text-primary-white/60 p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-dark-border/50 hover:bg-dark-bg/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-dark-bg rounded-sm overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-white">{product.name}</p>
                        <p className="text-xs text-primary-white/50 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-primary-white/80 capitalize">{product.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-primary-white/60">{product.collection}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-primary-gold">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {product.new && (
                        <span className="inline-block px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-500 text-xs rounded-sm">
                          Novo
                        </span>
                      )}
                      {product.featured && (
                        <span className="inline-block px-2 py-1 bg-primary-gold/10 border border-primary-gold/30 text-primary-gold text-xs rounded-sm">
                          Destaque
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-primary-white/60 hover:text-blue-500 hover:bg-blue-500/10 rounded-sm transition-all">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-primary-white/60 hover:text-primary-gold hover:bg-primary-gold/10 rounded-sm transition-all">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-primary-white/60 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
