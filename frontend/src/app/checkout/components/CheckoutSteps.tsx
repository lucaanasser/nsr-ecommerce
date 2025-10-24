/**
 * Componente de Indicador de Etapas do Checkout
 * Mostra visualmente em qual etapa o usuário está
 */

import type { CheckoutStep } from '@/types/checkout.types';

interface CheckoutStepsProps {
  etapaAtual: CheckoutStep;
}

const etapas = [
  { id: 'comprador' as CheckoutStep, numero: 1, titulo: 'Dados' },
  { id: 'destinatario' as CheckoutStep, numero: 2, titulo: 'Entrega' },
  { id: 'pagamento' as CheckoutStep, numero: 3, titulo: 'Pagamento' },
  { id: 'confirmacao' as CheckoutStep, numero: 4, titulo: 'Confirmação' },
];

export default function CheckoutSteps({ etapaAtual }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {etapas.map((etapa, index) => (
        <div key={etapa.id} className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              etapaAtual === etapa.id ? 'text-primary-bronze' : 'text-primary-white/30'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                etapaAtual === etapa.id
                  ? 'border-primary-bronze bg-primary-bronze/20'
                  : 'border-primary-white/30'
              }`}
            >
              {etapa.numero}
            </div>
            <span className="hidden md:inline text-sm uppercase tracking-wider">
              {etapa.titulo}
            </span>
          </div>

          {/* Linha divisória entre etapas */}
          {index < etapas.length - 1 && (
            <div className="w-12 h-0.5 bg-primary-white/30" />
          )}
        </div>
      ))}
    </div>
  );
}
