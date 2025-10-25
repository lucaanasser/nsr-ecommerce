import { ProductVariant } from '../../types/variant.types';
import Input from '@/components/ui/Input';

interface SingleStockInputProps {
  variant: ProductVariant;
  onUpdate: (id: string, updates: Partial<ProductVariant>) => void;
}

/**
 * Input único de estoque (Tamanho único + sem cores)
 */
export default function SingleStockInput({ variant, onUpdate }: SingleStockInputProps) {
  const handleStockChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;
    onUpdate(variant.id, { stock: numValue });
  };

  return (
    <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6">
      <label className="block text-sm font-medium text-primary-white mb-3">
        Estoque Total <span className="text-red-500">*</span>
      </label>
      <Input
        type="number"
        min="0"
        value={variant.stock}
        onChange={(e) => handleStockChange(e.target.value)}
        placeholder="0"
        className="text-lg font-semibold"
      />
      <p className="mt-2 text-xs text-primary-white/50">
        Quantidade total disponível em estoque
      </p>
    </div>
  );
}
