'use client';

import { useState } from 'react';
import { Search, AlertTriangle, Plus, Minus } from 'lucide-react';
import { mockStock } from '@/data/adminData';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/**
 * Página de Controle de Estoque
 * Visualização e gestão de estoque por produto/tamanho
 */
export default function AdminEstoque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Filtrar estoque
  const filteredStock = mockStock.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = !showLowStockOnly || item.quantity <= item.minStock;
    return matchesSearch && matchesLowStock;
  });

  // Contador de alertas
  const lowStockCount = mockStock.filter(item => item.quantity <= item.minStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">Controle de Estoque</h1>
        <p className="text-primary-white/60">Gerencie o estoque de todos os produtos</p>
      </div>

      {/* Alertas */}
      {lowStockCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-sm p-4 flex items-start gap-3"
        >
          <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-yellow-500 mb-1">Atenção: Estoque Baixo</p>
            <p className="text-sm text-primary-white/70">
              {lowStockCount} {lowStockCount === 1 ? 'produto está' : 'produtos estão'} com estoque abaixo do mínimo
            </p>
          </div>
        </motion.div>
      )}

      {/* Filtros */}
      <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/40 pointer-events-none z-10" size={18} />
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..."
              className="pl-10 bg-dark-bg/50"
            />
          </div>

          {/* Toggle Estoque Baixo */}
          <Button
            variant={showLowStockOnly ? 'primary' : 'secondary'}
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className="whitespace-nowrap"
          >
            <AlertTriangle size={16} className="mr-2" />
            Apenas Estoque Baixo
          </Button>
        </div>

        {/* Contador */}
        <div className="mt-3 text-sm text-primary-white/50">
          {filteredStock.length} {filteredStock.length === 1 ? 'item' : 'itens'}
        </div>
      </div>

      {/* Tabela de Estoque */}
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
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Tamanho</th>
                <th className="text-left text-sm font-medium text-primary-white/60 p-4">Categoria</th>
                <th className="text-center text-sm font-medium text-primary-white/60 p-4">Estoque Atual</th>
                <th className="text-center text-sm font-medium text-primary-white/60 p-4">Estoque Mínimo</th>
                <th className="text-center text-sm font-medium text-primary-white/60 p-4">Status</th>
                <th className="text-right text-sm font-medium text-primary-white/60 p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((item, index) => {
                const isLowStock = item.quantity <= item.minStock;
                const percentage = (item.quantity / item.minStock) * 100;
                
                return (
                  <motion.tr
                    key={`${item.productId}-${item.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-b border-dark-border/50 hover:bg-dark-bg/30 transition-colors ${
                      isLowStock ? 'bg-yellow-500/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <span className="text-sm font-medium text-primary-white">{item.productName}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-primary-white/80 font-mono">{item.size}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-primary-white/60 capitalize">{item.category}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-bold ${isLowStock ? 'text-yellow-500' : 'text-primary-white'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm text-primary-white/60">{item.minStock}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        {isLowStock ? (
                          <span className="inline-block px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs rounded-sm">
                            Baixo
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-500 text-xs rounded-sm">
                            OK
                          </span>
                        )}
                        <div className="w-16 bg-dark-bg rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percentage <= 100 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" className="p-2 text-red-500 hover:bg-red-500/10">
                          <Minus size={16} />
                        </Button>
                        <Button variant="ghost" className="p-2 text-green-500 hover:bg-green-500/10">
                          <Plus size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredStock.length === 0 && (
          <div className="text-center py-12">
            <p className="text-primary-white/50">Nenhum item encontrado</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
