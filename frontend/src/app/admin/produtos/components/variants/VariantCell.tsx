import { ProductVariant, getStockStatusColor, getStockStatusBg } from '../../types/variant.types';
import Input from '@/components/ui/Input';

interface VariantCellProps {
  variant: ProductVariant;
  onUpdate: (id: string, updates: Partial<ProductVariant>) => void;
}

/**
 * Célula individual da matriz de variantes
 * Usado no FullVariantMatrix
 */
export default function VariantCell({ variant, onUpdate }: VariantCellProps) {
  const handleStockChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;
    onUpdate(variant.id, { stock: numValue });
  };

  return (
    <div className={`p-2 rounded ${getStockStatusBg(variant.stock)}`}>
      <Input
        type="number"
        min="0"
        value={variant.stock}
        onChange={(e) => handleStockChange(e.target.value)}
        className={`text-center font-semibold ${getStockStatusColor(variant.stock)}`}
      />
    </div>
  );
}
