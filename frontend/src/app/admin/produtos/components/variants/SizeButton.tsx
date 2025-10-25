import { SizeOption } from '../../types/variant.types';

interface SizeButtonProps {
  size: SizeOption;
  isSelected: boolean;
  onToggle: () => void;
}

/**
 * Botão individual de tamanho
 */
export default function SizeButton({
  size,
  isSelected,
  onToggle,
}: SizeButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        px-4 py-3 rounded-sm border-2 font-semibold text-sm
        transition-all duration-200 ease-in-out
        ${
          isSelected
            ? 'border-primary-gold bg-primary-gold/10 text-primary-gold ring-2 ring-primary-gold/50'
            : 'border-dark-border bg-dark-card text-primary-white hover:border-primary-gold/50 hover:scale-105'
        }
      `}
    >
      {size.label}
    </button>
  );
}
