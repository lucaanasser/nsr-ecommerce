import { z } from 'zod';

/**
 * Validators para Product API
 * Schemas Zod para validação de dados de produtos, categorias e coleções
 */

// ========== PRODUCT SCHEMAS ==========

// Criar produto
export const createProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome muito longo'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  comparePrice: z.number().positive('Preço de comparação deve ser positivo').optional(),
  stock: z.number().int('Estoque deve ser um número inteiro').min(0, 'Estoque não pode ser negativo'),
  sku: z.string().optional(),
  categoryId: z.string().uuid('ID de categoria inválido').optional(),
  collectionId: z.string().uuid('ID de coleção inválido').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']).optional(),
  images: z.array(z.string().url('URL de imagem inválida')).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// Atualizar produto (todos os campos opcionais)
export const updateProductSchema = createProductSchema.partial();

// ========== VARIANT SCHEMAS ==========

// Criar variante
export const createVariantSchema = z.object({
  productId: z.string().uuid('ID de produto inválido'),
  size: z.string().min(1, 'Tamanho é obrigatório'),
  color: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo').optional(),
  stock: z.number().int('Estoque deve ser um número inteiro').min(0, 'Estoque não pode ser negativo'),
  isActive: z.boolean().optional(),
});

// Atualizar variante
export const updateVariantSchema = createVariantSchema.partial().omit({ productId: true });

// ========== CATEGORY SCHEMAS ==========

// Criar categoria
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100, 'Nome muito longo'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().optional(),
  image: z.string().url('URL de imagem inválida').optional(),
});

// Atualizar categoria
export const updateCategorySchema = createCategorySchema.partial();

// ========== COLLECTION SCHEMAS ==========

// Criar coleção
export const createCollectionSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100, 'Nome muito longo'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().optional(),
  image: z.string().url('URL de imagem inválida').optional(),
});

// Atualizar coleção
export const updateCollectionSchema = createCollectionSchema.partial();

// ========== FILTER & PAGINATION SCHEMAS ==========

// Filtros de produtos
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid('ID de categoria inválido').optional(),
  collectionId: z.string().uuid('ID de coleção inválido').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']).optional(),
  minPrice: z.coerce.number().positive('Preço mínimo deve ser positivo').optional(),
  maxPrice: z.coerce.number().positive('Preço máximo deve ser positivo').optional(),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
});

// Paginação
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  orderBy: z.enum([
    'price_asc',
    'price_desc',
    'newest',
    'popular',
    'name_asc',
    'name_desc',
  ]).optional(),
});

// ========== PARAMS SCHEMAS ==========

// Validação de UUID em params
export const uuidParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

// Validação de slug em params
export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório'),
});

// ========== TYPE EXPORTS ==========

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
