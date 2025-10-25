import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { SizeType, SizeOption, SIZE_PRESETS } from '../../types/variant.types';
import SizeButton from './SizeButton';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SizeGridProps {
  sizeType: SizeType;
  selectedSizes: SizeOption[];
  onToggleSize: (size: SizeOption) => void;
  onAddCustomSize: (size: SizeOption) => void;
  onRemoveCustomSize?: (size: SizeOption) => void;
}

/**
 * Grid de seleção de tamanhos
 */
export default function SizeGrid({
  sizeType,
  selectedSizes,
  onToggleSize,
  onAddCustomSize,
  onRemoveCustomSize,
}: SizeGridProps) {
  const [customSizeValue, setCustomSizeValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Obter tamanhos disponíveis baseado no tipo
  const availableSizes = SIZE_PRESETS[sizeType];

  // Separar tamanhos customizados dos predefinidos
  const customSizes = selectedSizes.filter(
    (size) => !availableSizes.some((preset) => preset.value === size.value)
  );

  const handleAddCustomSize = () => {
    if (!customSizeValue.trim()) return;

    const newSize: SizeOption = {
      value: customSizeValue.toLowerCase().trim(),
      label: customSizeValue.toUpperCase().trim(),
      order: selectedSizes.length,
    };

    onAddCustomSize(newSize);
    setCustomSizeValue('');
    setShowCustomInput(false);
  };

  const isSizeSelected = (size: SizeOption) => {
    return selectedSizes.some((s) => s.value === size.value);
  };

  // Para tamanho único, não mostrar grid
  if (sizeType === 'unique') {
    return (
      <div className="p-4 bg-dark-card/30 border border-dark-border rounded-sm">
        <p className="text-sm text-primary-white/60">
          Este produto não possui variação de tamanho.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid de tamanhos predefinidos */}
      {availableSizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-primary-white mb-3">
            Selecione os tamanhos disponíveis
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
            {availableSizes.map((size) => (
              <SizeButton
                key={size.value}
                size={size}
                isSelected={isSizeSelected(size)}
                onToggle={() => onToggleSize(size)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tamanhos customizados (apenas para tipo custom) */}
      {sizeType === 'custom' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-primary-white">
              Tamanhos Customizados
            </label>
            {!showCustomInput && (
              <Button
                variant="ghost"
                onClick={() => setShowCustomInput(true)}
                className="flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Adicionar Tamanho
              </Button>
            )}
          </div>

          {/* Input para adicionar tamanho customizado */}
          {showCustomInput && (
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={customSizeValue}
                onChange={(e) => setCustomSizeValue(e.target.value)}
                placeholder="Ex: XP, 3XG, 56..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSize();
                  }
                }}
                className="flex-1"
              />
              <Button variant="primary" onClick={handleAddCustomSize}>
                Adicionar
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomSizeValue('');
                }}
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* Lista de tamanhos customizados */}
          {customSizes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customSizes.map((size) => (
                <div
                  key={size.value}
                  className="flex items-center gap-2 px-3 py-2 bg-primary-gold/10 border border-primary-gold/30 rounded-sm"
                >
                  <span className="text-sm font-semibold text-primary-gold">
                    {size.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleSize(size);
                      onRemoveCustomSize?.(size);
                    }}
                    className="text-primary-gold/60 hover:text-primary-gold transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback de seleção */}
      {selectedSizes.length > 0 && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-sm">
          <p className="text-sm text-green-500">
            ✓ {selectedSizes.length} tamanho
            {selectedSizes.length !== 1 ? 's' : ''} selecionado
            {selectedSizes.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
