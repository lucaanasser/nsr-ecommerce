import { SizeType, SizeOption } from '../../types/variant.types';
import SizeTypeSelector from './SizeTypeSelector';
import SizeGrid from './SizeGrid';

interface SizeSelectorProps {
  sizeType: SizeType;
  sizes: SizeOption[];
  onSizeTypeChange: (type: SizeType) => void;
  onSizesChange: (sizes: SizeOption[]) => void;
}

/**
 * Componente principal para seleção de tamanhos
 * Inclui seletor de tipo e grid de tamanhos
 */
export default function SizeSelector({
  sizeType,
  sizes,
  onSizeTypeChange,
  onSizesChange,
}: SizeSelectorProps) {
  const handleToggleSize = (size: SizeOption) => {
    const isSelected = sizes.some((s) => s.value === size.value);

    if (isSelected) {
      // Remover tamanho
      onSizesChange(sizes.filter((s) => s.value !== size.value));
    } else {
      // Adicionar tamanho (mantendo ordem)
      onSizesChange([...sizes, size].sort((a, b) => a.order - b.order));
    }
  };

  const handleAddCustomSize = (size: SizeOption) => {
    onSizesChange([...sizes, size]);
  };

  const handleRemoveCustomSize = (size: SizeOption) => {
    onSizesChange(sizes.filter((s) => s.value !== size.value));
  };

  // Limpar seleção ao mudar tipo de grade
  const handleSizeTypeChange = (newType: SizeType) => {
    onSizeTypeChange(newType);
    
    // Se mudou para tamanho único, setar automaticamente
    if (newType === 'unique') {
      onSizesChange([{ value: 'unico', label: 'Tamanho Único', order: 0 }]);
    } else {
      // Limpar seleção ao mudar de tipo
      onSizesChange([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Tipo */}
      <SizeTypeSelector selected={sizeType} onChange={handleSizeTypeChange} />

      {/* Grid de Tamanhos */}
      <SizeGrid
        sizeType={sizeType}
        selectedSizes={sizes}
        onToggleSize={handleToggleSize}
        onAddCustomSize={handleAddCustomSize}
        onRemoveCustomSize={handleRemoveCustomSize}
      />
    </div>
  );
}
