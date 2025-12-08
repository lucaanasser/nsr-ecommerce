/**
 * Componente de seleção de método de frete
 * Exibe opções calculadas e permite seleção
 */

import { motion } from 'framer-motion';
import { Truck, Clock, Check, Loader2, AlertCircle } from 'lucide-react';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  isFree: boolean;
}

interface ShippingMethodSelectorProps {
  metodos: ShippingMethod[];
  metodoSelecionado: ShippingMethod | null;
  calculando: boolean;
  erro: string | null;
  onSelecionar: (metodo: ShippingMethod) => void;
}

export default function ShippingMethodSelector({
  metodos,
  metodoSelecionado,
  calculando,
  erro,
  onSelecionar,
}: ShippingMethodSelectorProps) {
  // Loading state
  if (calculando) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-dark-card border border-dark-border rounded-sm"
      >
        <div className="flex items-center justify-center gap-3 text-primary-white/70">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm">Calculando opções de frete...</span>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (erro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-red-500/10 border border-red-500/30 rounded-sm"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-red-400 mb-1">Erro ao calcular frete</p>
            <p className="text-xs text-red-400/80">{erro}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // No methods available
  if (metodos.length === 0) {
    return null;
  }

  // Methods list
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 mb-4">
        <Truck className="text-primary-bronze" size={20} />
        <h3 className="font-semibold text-primary-white">Escolha o método de envio:</h3>
      </div>

      {metodos.map((metodo) => {
        const isSelected = metodoSelecionado?.id === metodo.id;
        
        return (
          <button
            key={metodo.id}
            type="button"
            onClick={() => onSelecionar(metodo)}
            className={`w-full p-4 rounded-sm border-2 transition-all text-left ${
              isSelected
                ? 'border-primary-bronze bg-primary-bronze/10'
                : 'border-dark-border hover:border-primary-bronze/50 bg-dark-bg/50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-primary-white">
                    {metodo.name}
                  </span>
                  {metodo.isFree && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-sm font-medium">
                      GRÁTIS
                    </span>
                  )}
                </div>
                
                {metodo.description && (
                  <p className="text-xs text-primary-white/50 mb-2">
                    {metodo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-primary-white/70">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>
                      {metodo.estimatedDays.min === metodo.estimatedDays.max
                        ? `${metodo.estimatedDays.min} ${metodo.estimatedDays.min === 1 ? 'dia' : 'dias'}`
                        : `${metodo.estimatedDays.min}-${metodo.estimatedDays.max} dias`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  {metodo.isFree ? (
                    <span className="text-lg font-bold text-green-400">GRÁTIS</span>
                  ) : (
                    <span className="text-lg font-bold text-primary-white">
                      R$ {metodo.cost.toFixed(2)}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary-bronze flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-dark-bg" />
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}
