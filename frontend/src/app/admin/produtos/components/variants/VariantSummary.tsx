import { Package, Box, DollarSign, AlertTriangle } from 'lucide-react';
import { useStockCalculator } from '../../hooks/useStockCalculator';
import { ProductVariant } from '../../types/variant.types';

interface VariantSummaryProps {
  variants: ProductVariant[];
  basePrice: number;
}

/**
 * Resumo estatístico das variantes
 */
export default function VariantSummary({ variants, basePrice }: VariantSummaryProps) {
  const {
    totalVariants,
    totalStock,
    totalValue,
    stockStatus,
    totalAlerts,
    lowStockVariants,
    outOfStockVariants,
  } = useStockCalculator(variants, basePrice);

  const stats = [
    {
      label: 'Total de Variantes',
      value: totalVariants,
      icon: Package,
      color: 'text-primary-gold',
      bgColor: 'bg-primary-gold/10',
      borderColor: 'border-primary-gold/30',
    },
    {
      label: 'Estoque Total',
      value: totalStock,
      icon: Box,
      color:
        stockStatus === 'error'
          ? 'text-red-500'
          : stockStatus === 'warning'
          ? 'text-yellow-500'
          : 'text-green-500',
      bgColor:
        stockStatus === 'error'
          ? 'bg-red-500/10'
          : stockStatus === 'warning'
          ? 'bg-yellow-500/10'
          : 'bg-green-500/10',
      borderColor:
        stockStatus === 'error'
          ? 'border-red-500/30'
          : stockStatus === 'warning'
          ? 'border-yellow-500/30'
          : 'border-green-500/30',
    },
    {
      label: 'Valor em Estoque',
      value: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-primary-gold',
      bgColor: 'bg-primary-gold/10',
      borderColor: 'border-primary-gold/30',
    },
    {
      label: 'Alertas',
      value: totalAlerts,
      icon: AlertTriangle,
      color:
        outOfStockVariants.length > 0
          ? 'text-red-500'
          : lowStockVariants.length > 0
          ? 'text-yellow-500'
          : 'text-green-500',
      bgColor:
        outOfStockVariants.length > 0
          ? 'bg-red-500/10'
          : lowStockVariants.length > 0
          ? 'bg-yellow-500/10'
          : 'bg-green-500/10',
      borderColor:
        outOfStockVariants.length > 0
          ? 'border-red-500/30'
          : lowStockVariants.length > 0
          ? 'border-yellow-500/30'
          : 'border-green-500/30',
    },
  ];

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-primary-white">Resumo de Estoque</h4>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-sm border ${stat.bgColor} ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-primary-white/60 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alertas detalhados */}
      {totalAlerts > 0 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-sm">
          <h5 className="text-sm font-semibold text-yellow-500 mb-2">⚠️ Alertas de Estoque</h5>
          <div className="space-y-1 text-sm">
            {outOfStockVariants.length > 0 && (
              <p className="text-red-500">
                • {outOfStockVariants.length} variante
                {outOfStockVariants.length !== 1 ? 's' : ''} esgotada
                {outOfStockVariants.length !== 1 ? 's' : ''}
              </p>
            )}
            {lowStockVariants.length > 0 && (
              <p className="text-yellow-500">
                • {lowStockVariants.length} variante{lowStockVariants.length !== 1 ? 's' : ''} com
                estoque baixo (≤ 5 unidades)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
