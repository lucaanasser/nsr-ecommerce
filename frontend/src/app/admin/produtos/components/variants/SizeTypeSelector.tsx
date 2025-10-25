import { SizeType } from '../../types/variant.types';

interface SizeTypeSelectorProps {
  selected: SizeType;
  onChange: (type: SizeType) => void;
}

const SIZE_TYPE_OPTIONS: Array<{
  value: SizeType;
  label: string;
  description: string;
}> = [
  {
    value: 'standard',
    label: 'Padrão',
    description: 'PP, P, M, G, GG, XGG, EXGG',
  },
  {
    value: 'numeric',
    label: 'Numérica',
    description: '34, 36, 38, 40, 42, 44, 46, 48, 50, 52',
  },
  {
    value: 'custom',
    label: 'Customizada',
    description: 'Defina seus próprios tamanhos',
  },
  {
    value: 'unique',
    label: 'Tamanho Único',
    description: 'Produto sem variação de tamanho',
  },
];

/**
 * Seletor de tipo de grade de tamanhos
 */
export default function SizeTypeSelector({
  selected,
  onChange,
}: SizeTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-primary-white">
        Tipo de Grade <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SIZE_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              p-4 rounded-sm border-2 text-left transition-all duration-200
              ${
                selected === option.value
                  ? 'border-primary-gold bg-primary-gold/10'
                  : 'border-dark-border bg-dark-card hover:border-primary-gold/50'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-semibold text-primary-white">
                {option.label}
              </span>
              {selected === option.value && (
                <div className="w-5 h-5 rounded-full bg-primary-gold flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-dark-bg"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </div>
            <p className="text-xs text-primary-white/60">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
