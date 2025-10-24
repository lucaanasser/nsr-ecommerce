import { Check } from 'lucide-react';

/**
 * Definição dos steps
 */
export interface Step {
  id: number;
  label: string;
  shortLabel?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps?: number[];
}

/**
 * Componente de indicador de progresso (wizard)
 */
export default function StepIndicator({ 
  steps, 
  currentStep,
  onStepClick,
  completedSteps = []
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop - Horizontal */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Linha de conexão */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-dark-border -z-10">
          <div 
            className="h-full bg-primary-gold transition-all duration-500"
            style={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.includes(index) || index < currentStep;
          const isClickable = onStepClick && (isCompleted || index <= currentStep);

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`
                flex flex-col items-center gap-2 relative
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                ${isClickable && !isActive ? 'hover:opacity-80' : ''}
              `}
            >
              {/* Círculo do número */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300 font-semibold text-sm
                  ${isActive 
                    ? 'bg-primary-gold border-primary-gold text-dark-bg scale-110' 
                    : isCompleted
                    ? 'bg-primary-gold/20 border-primary-gold text-primary-gold'
                    : 'bg-dark-bg border-dark-border text-primary-white/40'
                  }
                `}
              >
                {isCompleted && !isActive ? (
                  <Check size={18} />
                ) : (
                  step.id + 1
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs font-medium whitespace-nowrap transition-colors
                  ${isActive 
                    ? 'text-primary-gold' 
                    : isCompleted 
                    ? 'text-primary-white/80'
                    : 'text-primary-white/40'
                  }
                `}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile - Compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-primary-white">
            Etapa {currentStep + 1} de {steps.length}
          </span>
          <span className="text-xs text-primary-white/60">
            {steps[currentStep].label}
          </span>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full h-1 bg-dark-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-gold transition-all duration-500"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}
