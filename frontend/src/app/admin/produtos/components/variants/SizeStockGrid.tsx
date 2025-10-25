import { ProductVariant, getStockStatusColor } from '../../types/variant.types';
import Input from '@/components/ui/Input';

interface SizeStockGridProps {
  variants: ProductVariant[];
  onUpdate: (id: string, updates: Partial<ProductVariant>) => void;
}

/**
 * Grid de inputs de estoque por tamanho (Múltiplos tamanhos + sem cores)
 */
export default function SizeStockGrid({ variants, onUpdate }: SizeStockGridProps) {
  const handleStockChange = (variantId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;
    onUpdate(variantId, { stock: numValue });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-primary-white">
        Estoque por Tamanho <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex flex-col gap-2 p-4 bg-dark-card/50 border border-dark-border rounded-sm"
          >
            {/* Tamanho */}
            <span className="text-sm font-semibold text-primary-white text-center">
              {variant.sizeLabel}
            </span>

            {/* Input de estoque */}
            <Input
              type="number"
              min="0"
              value={variant.stock}
              onChange={(e) => handleStockChange(variant.id, e.target.value)}
              className={`text-center font-semibold ${getStockStatusColor(variant.stock)}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
