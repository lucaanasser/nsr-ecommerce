import { Check, Package } from 'lucide-react';
import Image from 'next/image';
import { ProductFormData } from '../../hooks/useProductForm';
import { useStockCalculator } from '../../hooks/useStockCalculator';

interface ReviewStepProps {
  formData: ProductFormData;
}

/**
 * Step 5: Revisão Final
 */
export default function ReviewStep({ formData }: ReviewStepProps) {
  // Calcular estatísticas de estoque usando as variantes completas
  const stockStats = useStockCalculator(formData.variantConfig.variants, formData.price);

  // Checklist de campos obrigatórios
  const checklist = [
    { label: 'Nome do produto', completed: !!formData.name },
    { label: 'Slug definido', completed: !!formData.slug },
    { label: 'Preço configurado', completed: formData.price > 0 },
    { label: 'Descrição adicionada', completed: !!formData.description },
    { label: 'Pelo menos uma imagem', completed: formData.images.length > 0 },
    { label: 'Variantes configuradas', completed: formData.variantConfig.variants.length > 0 },
  ];

  const allCompleted = checklist.every(item => item.completed);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-primary-white mb-2">
          Revisão Final
        </h3>
        <p className="text-sm text-primary-white/60">
          Confira todos os dados antes de publicar o produto
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6">
        <h4 className="text-sm font-semibold text-primary-white mb-4">
          Checklist de Campos Obrigatórios
        </h4>
        
        <div className="space-y-3">
          {checklist.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center
                  ${item.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-dark-bg border border-dark-border text-primary-white/30'
                  }
                `}
              >
                {item.completed && <Check size={14} />}
              </div>
              <span
                className={`text-sm ${
                  item.completed ? 'text-primary-white' : 'text-primary-white/50'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {allCompleted ? (
          <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-sm">
            <p className="text-sm text-green-500 font-medium">
              ✓ Todos os campos obrigatórios foram preenchidos!
            </p>
          </div>
        ) : (
          <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-sm">
            <p className="text-sm text-yellow-500">
              ⚠ Alguns campos obrigatórios ainda não foram preenchidos
            </p>
          </div>
        )}
      </div>

      {/* Preview do Produto */}
      <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6">
        <h4 className="text-sm font-semibold text-primary-white mb-4">
          Preview do Produto
        </h4>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Imagem Principal */}
          <div>
            {formData.images.length > 0 ? (
              <div className="aspect-square bg-dark-bg rounded-sm overflow-hidden">
                <Image
                  src={formData.images.find(img => img.isPrimary)?.url || formData.images[0].url}
                  alt={formData.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-dark-bg rounded-sm flex items-center justify-center">
                <p className="text-primary-white/30 text-sm">Sem imagem</p>
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-4">
            <div>
              <h5 className="text-2xl font-bold text-primary-white mb-2">
                {formData.name || 'Nome do produto'}
              </h5>
              {formData.sku && (
                <p className="text-xs text-primary-white/50">
                  SKU: {formData.sku}
                </p>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary-gold">
                R$ {formData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              {formData.comparePrice && formData.comparePrice > formData.price && (
                <span className="text-lg text-primary-white/50 line-through">
                  R$ {formData.comparePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {formData.isFeatured && (
                <span className="px-2 py-1 bg-primary-gold/10 border border-primary-gold/30 text-primary-gold text-xs rounded-sm">
                  Destaque
                </span>
              )}
              {formData.isActive ? (
                <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-500 text-xs rounded-sm">
                  Ativo
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-sm">
                  Inativo
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-dark-border">
              <p className="text-sm text-primary-white/80 whitespace-pre-wrap">
                {formData.description || 'Sem descrição'}
              </p>
            </div>

            {formData.material && (
              <div className="pt-4 border-t border-dark-border">
                <p className="text-xs font-semibold text-primary-white/60 mb-1">
                  MATERIAL
                </p>
                <p className="text-sm text-primary-white/80">
                  {formData.material}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview de Variantes */}
      {formData.variantConfig.variants.length > 0 && (
        <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6">
          <h4 className="text-sm font-semibold text-primary-white mb-4 flex items-center gap-2">
            <Package size={16} />
            Variantes do Produto
          </h4>

          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-dark-bg/50 rounded-sm">
              <p className="text-xs text-primary-white/60 mb-1">Total de Variantes</p>
              <p className="text-2xl font-bold text-primary-white">
                {stockStats.totalVariants}
              </p>
            </div>
            <div className="p-4 bg-dark-bg/50 rounded-sm">
              <p className="text-xs text-primary-white/60 mb-1">Estoque Total</p>
              <p className="text-2xl font-bold text-primary-gold">
                {stockStats.totalStock}
              </p>
            </div>
            <div className="p-4 bg-dark-bg/50 rounded-sm">
              <p className="text-xs text-primary-white/60 mb-1">Valor Total</p>
              <p className="text-lg font-bold text-green-500">
                R$ {stockStats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 bg-dark-bg/50 rounded-sm">
              <p className="text-xs text-primary-white/60 mb-1">Status</p>
              <p className={`text-sm font-bold ${
                stockStats.stockStatus === 'error' ? 'text-red-500' :
                stockStats.stockStatus === 'warning' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {stockStats.stockStatus === 'error' ? 'Esgotado' :
                 stockStats.stockStatus === 'warning' ? 'Estoque Baixo' :
                 'Disponível'}
              </p>
            </div>
          </div>

          {/* Lista de Variantes */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {formData.variantConfig.variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-sm hover:bg-dark-bg/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Cor (se houver) */}
                  {variant.colorHex && (
                    <div
                      className="w-6 h-6 rounded-full border-2 border-dark-border flex-shrink-0"
                      style={{ backgroundColor: variant.colorHex }}
                      title={variant.colorName || ''}
                    />
                  )}

                  {/* Tamanho e Nome */}
                  <div>
                    <p className="text-sm font-medium text-primary-white">
                      {variant.sizeLabel}
                      {variant.colorName && (
                        <span className="text-primary-white/60 ml-2">
                          • {variant.colorName}
                        </span>
                      )}
                    </p>
                    {variant.sku && (
                      <p className="text-xs text-primary-white/40">
                        SKU: {variant.sku}
                      </p>
                    )}
                  </div>
                </div>

                {/* Estoque */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-white">
                      {variant.stock} un.
                    </p>
                    <p className="text-xs text-primary-white/50">
                      R$ {(variant.stock * formData.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className={`
                    w-2 h-2 rounded-full
                    ${variant.stock === 0 ? 'bg-red-500' : variant.stock <= 5 ? 'bg-yellow-500' : 'bg-green-500'}
                  `} />
                </div>
              </div>
            ))}
          </div>

          {/* Alertas */}
          {(stockStats.lowStockVariants.length > 0 || stockStats.outOfStockVariants.length > 0) && (
            <div className="mt-4 space-y-2">
              {stockStats.outOfStockVariants.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
                  <p className="text-sm text-red-500">
                    ⚠ {stockStats.outOfStockVariants.length} variante(s) sem estoque
                  </p>
                </div>
              )}
              {stockStats.lowStockVariants.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-sm">
                  <p className="text-sm text-yellow-500">
                    ⚠ {stockStats.lowStockVariants.length} variante(s) com estoque baixo (≤5 unidades)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
