import { Check } from 'lucide-react';
import Image from 'next/image';
import { ProductFormData } from '../../hooks/useProductForm';

interface ReviewStepProps {
  formData: ProductFormData;
}

/**
 * Step 4: Revisão Final
 */
export default function ReviewStep({ formData }: ReviewStepProps) {
  // Checklist de campos obrigatórios
  const checklist = [
    { label: 'Nome do produto', completed: !!formData.name },
    { label: 'Slug definido', completed: !!formData.slug },
    { label: 'Preço configurado', completed: formData.price > 0 },
    { label: 'Descrição adicionada', completed: !!formData.description },
    { label: 'Pelo menos uma imagem', completed: formData.images.length > 0 },
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

            <div className="pt-4 border-t border-dark-border">
              <p className="text-xs font-semibold text-primary-white/60 mb-1">
                ESTOQUE
              </p>
              <p className="text-sm text-primary-white/80">
                {formData.stock} unidades disponíveis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
