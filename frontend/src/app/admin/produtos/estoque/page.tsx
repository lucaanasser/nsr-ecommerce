'use client';

import { Package, AlertTriangle } from 'lucide-react';
import EmptyState from '../components/EmptyState';

/**
 * Página de Gestão de Estoque
 * TODO: Implementar funcionalidades
 */
export default function EstoquePage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-card/50 border border-dark-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-white/60">Total de Produtos</span>
            <Package className="text-primary-gold" size={20} />
          </div>
          <p className="text-2xl font-bold text-primary-white">24</p>
        </div>

        <div className="bg-dark-card/50 border border-dark-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-white/60">Em Estoque</span>
            <Package className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-primary-white">18</p>
        </div>

        <div className="bg-dark-card/50 border border-dark-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-white/60">Estoque Baixo</span>
            <AlertTriangle className="text-yellow-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-primary-white">4</p>
        </div>

        <div className="bg-dark-card/50 border border-dark-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-white/60">Esgotados</span>
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-primary-white">2</p>
        </div>
      </div>

      {/* Conteúdo */}
      <EmptyState
        title="Gestão de Estoque"
        description="Funcionalidade em desenvolvimento. Em breve você poderá gerenciar todo o estoque por aqui."
        icon={<Package className="text-primary-white/30" size={48} />}
      />
    </div>
  );
}
