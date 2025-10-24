import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ProductFormData } from '../../hooks/useProductForm';

interface ImagesStepProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  onUpdateField: <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => void;
}

/**
 * Step 3: Imagens do Produto
 */
export default function ImagesStep({
  formData,
  errors,
  onUpdateField,
}: ImagesStepProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Handler para adicionar imagens
  const handleImageAdd = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map((file, index) => ({
      url: URL.createObjectURL(file),
      altText: formData.name || 'Imagem do produto',
      order: formData.images.length + index,
      isPrimary: formData.images.length === 0 && index === 0,
    }));

    onUpdateField('images', [...formData.images, ...newImages]);
  };

  // Handler para remover imagem
  const handleImageRemove = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    
    // Reordenar e ajustar primary
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
      isPrimary: i === 0,
    }));

    onUpdateField('images', reorderedImages);
  };

  // Handler para definir imagem principal
  const handleSetPrimary = (index: number) => {
    const newImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));

    onUpdateField('images', newImages);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageAdd(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-primary-white mb-2">
          Imagens do Produto
        </h3>
        <p className="text-sm text-primary-white/60">
          Adicione fotos do produto. A primeira será a imagem principal.
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-sm p-8 text-center transition-colors
          ${isDragging 
            ? 'border-primary-gold bg-primary-gold/10' 
            : errors.images
            ? 'border-red-500 bg-red-500/5'
            : 'border-dark-border bg-dark-bg/50 hover:border-primary-gold/50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-dark-card rounded-full flex items-center justify-center">
            <Upload className="text-primary-gold" size={32} />
          </div>
          
          <div>
            <p className="text-primary-white font-medium mb-1">
              Arraste imagens ou clique para selecionar
            </p>
            <p className="text-sm text-primary-white/60">
              PNG, JPG, WEBP até 5MB
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageAdd(e.target.files)}
              className="hidden"
            />
            <span className="inline-block px-6 py-2 bg-primary-gold hover:bg-primary-gold/90 text-dark-bg font-medium rounded-sm transition-colors">
              Selecionar Arquivos
            </span>
          </label>
        </div>
      </div>

      {errors.images && (
        <p className="text-sm text-red-500">{errors.images}</p>
      )}

      {/* Preview das Imagens */}
      {formData.images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-primary-white mb-3">
            Imagens Adicionadas ({formData.images.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square bg-dark-bg rounded-sm overflow-hidden border-2 border-dark-border"
              >
                <Image
                  src={image.url}
                  alt={image.altText || `Imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Badge de imagem principal */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary-gold text-dark-bg text-xs font-semibold rounded">
                    Principal
                  </div>
                )}

                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-dark-bg/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(index)}
                      className="px-3 py-1 bg-primary-gold hover:bg-primary-gold/90 text-dark-bg text-xs font-medium rounded transition-colors"
                    >
                      Tornar Principal
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleImageRemove(index)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {formData.images.length === 0 && !errors.images && (
        <div className="text-center py-8">
          <ImageIcon className="mx-auto text-primary-white/30 mb-2" size={48} />
          <p className="text-sm text-primary-white/60">
            Nenhuma imagem adicionada ainda
          </p>
        </div>
      )}
    </div>
  );
}
