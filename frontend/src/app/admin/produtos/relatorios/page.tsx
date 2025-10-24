'use client';

import { TrendingUp, BarChart, PieChart } from 'lucide-react';
import EmptyState from '../components/EmptyState';

/**
 * Página de Relatórios e Analytics
 * TODO: Implementar dashboards e relatórios
 */
export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      {/* Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6 text-center">
          <BarChart className="mx-auto text-primary-gold mb-3" size={40} />
          <h3 className="text-lg font-semibold text-primary-white mb-2">
            Vendas por Categoria
          </h3>
          <p className="text-sm text-primary-white/60">
            Em breve
          </p>
        </div>

        <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6 text-center">
          <PieChart className="mx-auto text-primary-gold mb-3" size={40} />
          <h3 className="text-lg font-semibold text-primary-white mb-2">
            Performance de Produtos
          </h3>
          <p className="text-sm text-primary-white/60">
            Em breve
          </p>
        </div>

        <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6 text-center">
          <TrendingUp className="mx-auto text-primary-gold mb-3" size={40} />
          <h3 className="text-lg font-semibold text-primary-white mb-2">
            Tendências e Insights
          </h3>
          <p className="text-sm text-primary-white/60">
            Em breve
          </p>
        </div>
      </div>

      <EmptyState
        title="Relatórios e Analytics"
        description="Funcionalidade em desenvolvimento. Em breve você terá acesso a dashboards completos com métricas e insights sobre seus produtos."
        icon={<TrendingUp className="text-primary-white/30" size={48} />}
      />
    </div>
  );
}
