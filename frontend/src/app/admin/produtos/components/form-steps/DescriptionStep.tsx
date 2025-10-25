import { ProductFormData } from '../../hooks/useProductForm';

interface DescriptionStepProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  onUpdateField: <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => void;
}

/**
 * Step 2: Descrição e Detalhes
 */
export default function DescriptionStep({
  formData,
  errors,
  onUpdateField,
}: DescriptionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-primary-white mb-2">
          Descrição e Detalhes
        </h3>
        <p className="text-sm text-primary-white/60">
          Adicione informações detalhadas sobre o produto
        </p>
      </div>

      <div className="space-y-6">
        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-primary-white mb-2">
            Descrição Completa <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onUpdateField('description', e.target.value)}
            placeholder="Descreva o produto em detalhes..."
            rows={6}
            className={`
              w-full px-4 py-3 bg-dark-bg border rounded-sm
              text-primary-white placeholder-primary-white/30
              focus:outline-none focus:ring-2 focus:ring-primary-gold
              resize-none
              ${errors.description ? 'border-red-500' : 'border-dark-border'}
            `}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-primary-white/50">
            {formData.description.length} caracteres
          </p>
        </div>

        {/* Especificações */}
        <div>
          <label className="block text-sm font-medium text-primary-white mb-2">
            Especificações
          </label>
          <textarea
            value={formData.specifications || ''}
            onChange={(e) => onUpdateField('specifications', e.target.value)}
            placeholder="Ex: Material: 100% Algodão Premium; Instruções de Cuidado: Lavar à mão em água fria. Não usar alvejante."
            rows={4}
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-primary-white placeholder-primary-white/30 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-gold resize-none"
          />
          <p className="mt-1 text-xs text-primary-white/50">
            Use o formato "Campo: Valor; Campo2: Valor2" para múltiplas especificações
          </p>
        </div>
      </div>
    </div>
  );
}
