import { X, ExternalLink, Edit } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Modal from './Modal';
import { Product } from '@/data/products';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="aspect-square bg-dark-bg rounded-sm overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-dark-bg rounded-sm overflow-hidden border-2 border-dark-border hover:border-primary-gold transition-colors cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
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
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-dark-bg border border-dark-border text-primary-white text-xs rounded-sm capitalize">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-dark-bg border border-dark-border text-primary-white/70 text-xs rounded-sm">
                {product.collection}
              </span>
              {product.featured && (
                <span className="px-3 py-1 bg-primary-gold/10 border border-primary-gold/30 text-primary-gold text-xs rounded-sm">
                  Destaque
                </span>
              )}
              {product.new && (
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 text-xs rounded-sm">
                  Novo
                </span>
              )}
            </div>

            {/* Descrição */}
            <div className="pt-4 border-t border-dark-border">
              <h3 className="text-sm font-semibold text-primary-white/60 mb-2">
                DESCRIÇÃO
              </h3>
              <p className="text-sm text-primary-white/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tamanhos */}
            <div className="pt-4 border-t border-dark-border">
              <h3 className="text-sm font-semibold text-primary-white/60 mb-2">
                TAMANHOS DISPONÍVEIS
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isUnavailable = product.unavailableSizes?.includes(size);
                  return (
                    <div
                      key={size}
                      className={`
                        px-4 py-2 border rounded-sm text-sm font-medium
                        ${isUnavailable
                          ? 'bg-dark-bg/50 border-dark-border text-primary-white/30 line-through'
                          : 'bg-dark-bg border-primary-gold/30 text-primary-white'
                        }
                      `}
                    >
                      {size}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cores */}
            <div className="pt-4 border-t border-dark-border">
              <h3 className="text-sm font-semibold text-primary-white/60 mb-2">
                CORES DISPONÍVEIS
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className="px-4 py-2 bg-dark-bg border border-dark-border text-primary-white text-sm rounded-sm"
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>

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
