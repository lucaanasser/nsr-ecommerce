import { X, ExternalLink, Edit } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Modal from './Modal';
import { Product } from '@/services/product.service';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: Product) => void;
}

/**
 * Modal de visualização rápida de produto
 * Mostra todas as informações principais sem sair da página
 */
export default function ProductQuickView({
  product,
  isOpen,
  onClose,
  onEdit,
}: ProductQuickViewProps) {
  if (!product) return null;

  // Extrair tamanhos e cores únicos das variantes
  const sizes = product.variants?.map(v => v.size).filter((v, i, a) => a.indexOf(v) === i) || [];
  const colors = product.variants?.map(v => v.color).filter((v, i, a) => v && a.indexOf(v) === i) as string[] || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="aspect-square bg-dark-bg rounded-sm overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-white/30">
                  Sem imagem
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-dark-bg rounded-sm overflow-hidden border-2 border-dark-border hover:border-primary-gold transition-colors cursor-pointer"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.name} - ${index + 1}`}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-6">
            {/* Cabeçalho */}
            <div>
              <h2 className="text-3xl font-bold text-primary-white mb-2">
                {product.name}
              </h2>
              <p className="text-sm text-primary-white/50">
                ID: {product.id} | Slug: {product.slug}
              </p>
            </div>

            {/* Preço */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary-gold">
                R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-primary-white/40 line-through">
                  R$ {Number(product.comparePrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <span className="px-3 py-1 bg-dark-bg border border-dark-border text-primary-white text-xs rounded-sm capitalize">
                  {product.category}
                </span>
              )}
              {product.collection && (
                <span className="px-3 py-1 bg-dark-bg border border-dark-border text-primary-white/70 text-xs rounded-sm">
                  {product.collection.name}
                </span>
              )}
              {product.isFeatured && (
                <span className="px-3 py-1 bg-primary-gold/10 border border-primary-gold/30 text-primary-gold text-xs rounded-sm">
                  Destaque
                </span>
              )}
              {!product.isActive && (
                <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-sm">
                  Inativo
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs rounded-sm">
                  Sem estoque
                </span>
              )}
            </div>

            {/* Descrição */}
            {product.details?.description && (
              <div className="pt-4 border-t border-dark-border">
                <h3 className="text-sm font-semibold text-primary-white/60 mb-2">
                  DESCRIÇÃO
                </h3>
                <p className="text-sm text-primary-white/80 leading-relaxed">
                  {product.details.description}
                </p>
              </div>
            )}

            {/* Tamanhos */}
            {sizes.length > 0 && (
              <div className="pt-4 border-t border-dark-border">
                <h3 className="text-sm font-semibold text-primary-white/60 mb-2">
                  TAMANHOS DISPONÍVEIS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const variant = product.variants?.find(v => v.size === size);
                    const hasStock = variant && variant.stock > 0;
                    return (
                      <div
                        key={size}
                        className={`
                          px-4 py-2 border rounded-sm text-sm font-medium
                          ${hasStock
                            ? 'bg-dark-bg border-primary-gold/30 text-primary-white'
                            : 'bg-dark-bg/50 border-dark-border text-primary-white/30 line-through'
                          }
                        `}
                      >
                        {size}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cores */}
            {colors.length > 0 && (
              <div className="pt-4 border-t border-dark-border">
                <h3 className="text-sm font-semibold text-primary-white/60 mb-2">
                  CORES DISPONÍVEIS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <div
                      key={color}
                      className="px-4 py-2 bg-dark-bg border border-dark-border text-primary-white text-sm rounded-sm"
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-3 pt-6">
              {onEdit && (
                <Button
                  variant="primary"
                  onClick={() => {
                    onEdit(product);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Editar Produto
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => window.open(`/produtos/${product.slug}`, '_blank')}
                className="flex items-center justify-center gap-2 border border-dark-border"
              >
                <ExternalLink size={18} />
                Ver na Loja
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
