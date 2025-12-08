import { CreateProductDTO } from '@/types/product';
import { ProductFormData } from '@/app/admin/produtos/hooks/useProductForm';

/**
 * Transforma dados do formulário para formato da API
 */
export function transformFormDataToAPI(formData: ProductFormData): CreateProductDTO {
  // Calcular estoque total
  const totalStock = formData.variantConfig.variants.reduce(
    (sum, v) => sum + (v.stock || 0),
    0
  );

  // Transformar variantes para formato da API
  const variants = formData.variantConfig.variants
    .filter(v => v.isActive)
    .map(v => ({
      size: v.size,
      color: v.color || undefined,
      colorHex: v.colorHex || undefined,
      stock: v.stock,
      sku: v.sku || undefined,
      priceAdjustment: v.priceAdjustment || 0,
    }));

  // Montar payload
  const payload: CreateProductDTO = {
    name: formData.name,
    slug: formData.slug,
    sku: formData.sku || undefined,
    price: formData.price,
    comparePrice: formData.comparePrice || undefined,
    stock: totalStock,
    category: formData.category || undefined,
    collectionId: formData.collectionId || undefined,
    gender: formData.gender,
    isFeatured: formData.isFeatured,
    isActive: formData.isActive,

    details: {
      description: formData.description,
      specifications: formData.specifications || undefined,
    },

    dimensions: formData.dimensions
      ? {
          weight: formData.dimensions.weight,
          length: formData.dimensions.length,
          width: formData.dimensions.width,
          height: formData.dimensions.height,
        }
      : undefined,

    seo: formData.seo
      ? {
          metaTitle: formData.seo.metaTitle || undefined,
          metaDescription: formData.seo.metaDescription || undefined,
          keywords: formData.seo.keywords || [],
        }
      : undefined,

    images: formData.images.map(img => ({
      url: img.url,
      altText: img.altText || undefined,
      order: img.order,
      isPrimary: img.isPrimary,
    })),

    variants: variants.length > 0 ? variants : undefined,
  };

  return payload;
}

/**
 * Calcula estoque total das variantes
 */
export function calculateTotalStock(variants: Array<{ stock: number }>): number {
  return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
}

/**
 * Gera SKU automaticamente para variante
 */
export function generateVariantSku(
  baseSku: string,
  size: string,
  color?: string
): string {
  const parts = [baseSku, size.toUpperCase()];
  
  if (color) {
    parts.push(color.toUpperCase().replace(/\s+/g, '-'));
  }
  
  return parts.join('-');
}

/**
 * Valida se todas as imagens têm URLs válidas (já foram uploadadas)
 */
export function validateImagesUploaded(
  images: Array<{ url: string; file?: File }>
): boolean {
  return images.every(img => img.url.startsWith('http') && !img.file);
}

/**
 * Extrai arquivos (Files) das imagens que ainda não foram uploadadas
 */
export function extractFilesToUpload(
  images: Array<{ url: string; file?: File }>
): File[] {
  return images
    .filter(img => img.file)
    .map(img => img.file as File);
}
