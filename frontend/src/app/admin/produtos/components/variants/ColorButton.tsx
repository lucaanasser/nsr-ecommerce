import { Check } from 'lucide-react';
import { ColorOption } from '../../types/variant.types';

interface ColorButtonProps {
  color: ColorOption;
  isSelected: boolean;
  onToggle: () => void;
}

/**
 * Botão individual de cor
 */
export default function ColorButton({
  color,
  isSelected,
  onToggle,
}: ColorButtonProps) {
  // Determinar se a cor é clara (para ajustar texto)
  const isLightColor = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const isLight = isLightColor(color.hex);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        group relative rounded-sm transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary-gold ring-offset-2 ring-offset-dark-bg' : ''}
      `}
      title={color.name}
    >
      <div
        className="w-full aspect-square rounded-sm border-2 transition-all"
        style={{
          backgroundColor: color.hex,
          borderColor: isSelected ? '#D4AF37' : isLight ? '#2A2A2A' : color.hex,
        }}
      >
        {/* Checkmark quando selecionado */}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${isLight ? 'bg-dark-bg' : 'bg-white'}
              `}
            >
              <Check
                size={16}
                className={isLight ? 'text-white' : 'text-dark-bg'}
              />
            </div>
          </div>
        )}
      </div>

      {/* Nome da cor (aparece no hover) */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        <span className="text-xs text-primary-white bg-dark-card px-2 py-1 rounded border border-dark-border">
          {color.name}
        </span>
      </div>
    </button>
  );
}
