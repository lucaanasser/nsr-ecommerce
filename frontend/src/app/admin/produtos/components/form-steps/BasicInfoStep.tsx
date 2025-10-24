import Input from '@/components/ui/Input';
import { ProductFormData } from '../../hooks/useProductForm';

interface BasicInfoStepProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  onUpdateField: <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => void;
  onUpdateName: (name: string) => void;
}

/**
 * Step 1: Informações Básicas
 */
export default function BasicInfoStep({
  formData,
  errors,
  onUpdateField,
  onUpdateName,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-primary-white mb-2">
          Informações Básicas
        </h3>
        <p className="text-sm text-primary-white/60">
          Defina as informações principais do produto
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome do Produto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary-white mb-2">
            Nome do Produto <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => onUpdateName(e.target.value)}
            placeholder="Ex: Oversized Tee Geometric"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-primary-white mb-2">
            Slug (URL) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.slug}
            onChange={(e) => onUpdateField('slug', e.target.value)}
            placeholder="oversized-tee-geometric"
            className={errors.slug ? 'border-red-500' : ''}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
          )}
          <p className="mt-1 text-xs text-primary-white/50">
            Gerado automaticamente. Apenas letras minúsculas, números e hífens.
          </p>
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-primary-white mb-2">
            SKU (Código)
          </label>
          <Input
            type="text"
            value={formData.sku}
            onChange={(e) => onUpdateField('sku', e.target.value)}
            placeholder="NSR-001"
          />
          <p className="mt-1 text-xs text-primary-white/50">
            Código único do produto (opcional)
          </p>
        </div>

        {/* Preço */}
        <div>
          <label className="block text-sm font-medium text-primary-white mb-2">
            Preço de Venda <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.price || ''}
            onChange={(e) => onUpdateField('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        {/* Preço Comparativo */}
        <div>
          <label className="block text-sm font-medium text-primary-white mb-2">
            Preço Comparativo (De:)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.comparePrice || ''}
            onChange={(e) => onUpdateField('comparePrice', parseFloat(e.target.value) || undefined)}
            placeholder="0.00"
          />
          <p className="mt-1 text-xs text-primary-white/50">
            Preço original para mostrar desconto
          </p>
        </div>

        {/* Estoque */}
        <div>
          <label className="block text-sm font-medium text-primary-white mb-2">
            Estoque Inicial <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="0"
            value={formData.stock || ''}
            onChange={(e) => onUpdateField('stock', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>

        {/* Gênero */}
        <div>
          <label className="block text-sm font-medium text-primary-white mb-2">
            Gênero
          </label>
          <select
            value={formData.gender}
            onChange={(e) => onUpdateField('gender', e.target.value as any)}
            className="w-full px-4 py-2 bg-dark-bg border border-dark-border text-primary-white rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-gold"
          >
            <option value="UNISEX">Unissex</option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
          </select>
        </div>
      </div>

      {/* Flags */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => onUpdateField('isFeatured', e.target.checked)}
            className="w-4 h-4 rounded border-dark-border bg-dark-bg text-primary-gold focus:ring-primary-gold"
          />
          <label htmlFor="isFeatured" className="text-sm text-primary-white">
            Produto em destaque (aparece na home)
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => onUpdateField('isActive', e.target.checked)}
            className="w-4 h-4 rounded border-dark-border bg-dark-bg text-primary-gold focus:ring-primary-gold"
          />
          <label htmlFor="isActive" className="text-sm text-primary-white">
            Produto ativo (visível na loja)
          </label>
        </div>
      </div>
    </div>
  );
}
