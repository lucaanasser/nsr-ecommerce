import { ProductVariant, getStockStatusColor } from '../../types/variant.types';
import Input from '@/components/ui/Input';

interface ColorStockListProps {
  variants: ProductVariant[];
  onUpdate: (id: string, updates: Partial<ProductVariant>) => void;
}

/**
 * Lista de inputs de estoque por cor (Tamanho único + com cores)
 */
export default function ColorStockList({ variants, onUpdate }: ColorStockListProps) {
  const handleStockChange = (variantId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;
    onUpdate(variantId, { stock: numValue });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-primary-white">
        Estoque por Cor <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center gap-3 p-4 bg-dark-card/50 border border-dark-border rounded-sm"
          >
            {/* Cor */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-10 h-10 rounded-full border-2 border-dark-border"
                style={{ backgroundColor: variant.colorHex }}
              />
              <span className="text-sm font-medium text-primary-white">
                {variant.colorName}
              </span>
            </div>

            {/* Input de estoque */}
            <div className="w-24">
              <Input
                type="number"
                min="0"
                value={variant.stock}
                onChange={(e) => handleStockChange(variant.id, e.target.value)}
                className={`text-center font-semibold ${getStockStatusColor(variant.stock)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
