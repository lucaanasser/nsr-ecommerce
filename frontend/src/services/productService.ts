/**
 * Service para operações de produtos
 * Gerencia todas as requisições relacionadas a produtos via API
 */

import api from './api';
import { getErrorMessage } from './api';
import { logger } from '@/utils/logger';
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
  PaginationParams,
  PaginatedResponse,
  CollectionResponse,
  CreateCollectionDTO,
  UpdateCollectionDTO,
  ProductStats,
  CheckSlugResponse,
  BulkActionResult,
  ImageUploadProgress,
} from '@/types/product';

// ================================
// CONSTANTES
// ================================

const ENDPOINTS = {
  // Produtos (públicos)
  PRODUCTS: '/products',
  PRODUCT_BY_SLUG: (slug: string) => `/products/${slug}`,
  FEATURED_PRODUCTS: '/products/featured',
  
  // Produtos (admin)
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_BY_ID: (id: string) => `/admin/products/${id}`,
  ADMIN_PRODUCT_IMAGES: (id: string) => `/admin/products/${id}/images`,
  ADMIN_PRODUCT_IMAGE: (id: string, imageId: string) => `/admin/products/${id}/images/${imageId}`,
  
  // Coleções
  COLLECTIONS: '/collections',
  COLLECTION_BY_SLUG: (slug: string) => `/collections/${slug}`,
  ADMIN_COLLECTIONS: '/admin/products/collections',
  ADMIN_COLLECTION_BY_ID: (id: string) => `/admin/products/collections/${id}`,
} as const;

// Configurações de retry
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// ================================
// HELPER FUNCTIONS
// ================================

/**
 * Aguarda um tempo específico (para retry)
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Verifica se um erro deve ser retentado
 */
const shouldRetry = (error: any, attempt: number): boolean => {
  if (attempt >= RETRY_CONFIG.maxRetries) return false;
  
  const status = error.response?.status;
  if (!status) return true; // Erro de rede, tentar novamente
  
  return RETRY_CONFIG.retryableStatuses.includes(status);
};

/**
 * Executa requisição com retry automático
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  operationName: string
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (shouldRetry(error, attempt)) {
        const delay = RETRY_CONFIG.retryDelay * Math.pow(2, attempt); // Exponential backoff
        console.warn(
          `${operationName} falhou (tentativa ${attempt + 1}/${RETRY_CONFIG.maxRetries}). ` +
          `Tentando novamente em ${delay}ms...`
        );
        await sleep(delay);
      } else {
        break;
      }
    }
  }
  
  throw lastError;
}

/**
 * Constrói query string a partir de objeto
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// ================================
// PRODUCT SERVICE
// ================================

class ProductService {
  // ========== READ OPERATIONS (PUBLIC) ==========
  
  /**
   * Lista produtos com filtros e paginação
   */
  async getProducts(
    filters?: ProductFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<ProductResponse>> {
    try {
      const params = {
        ...filters,
        ...pagination,
      };
      
      const queryString = buildQueryString(params);
      
      const response = await withRetry(
        () => api.get(`${ENDPOINTS.PRODUCTS}${queryString}`),
        'getProducts'
      );
      
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Busca produto por slug (público)
   */
  async getProductBySlug(slug: string): Promise<ProductResponse> {
    try {
      const response = await withRetry(
        () => api.get(ENDPOINTS.PRODUCT_BY_SLUG(slug)),
        'getProductBySlug'
      );
      
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${slug}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Busca produtos em destaque
   */
  async getFeaturedProducts(limit: number = 8): Promise<ProductResponse[]> {
    try {
      const response = await withRetry(
        () => api.get(`${ENDPOINTS.FEATURED_PRODUCTS}?limit=${limit}`),
        'getFeaturedProducts'
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Busca todas as categorias únicas em uso
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await withRetry(
        () => api.get('/products/categories'),
        'getCategories'
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  // ========== ADMIN OPERATIONS ==========
  
  /**
   * Busca produto por ID (admin)
   */
  async getProductById(id: string): Promise<ProductResponse> {
    try {
      const response = await withRetry(
        () => api.get(ENDPOINTS.ADMIN_PRODUCT_BY_ID(id)),
        'getProductById'
      );
      
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Cria novo produto (admin)
   */
  async createProduct(data: CreateProductDTO): Promise<ProductResponse> {
    try {
      logger.api.request('POST', ENDPOINTS.ADMIN_PRODUCTS, {
        name: data.name,
        slug: data.slug,
        price: data.price,
        images: data.images?.length || 0,
        variants: data.variants?.length || 0,
      });

      const response = await api.post(ENDPOINTS.ADMIN_PRODUCTS, data);
      
      logger.api.response('POST', ENDPOINTS.ADMIN_PRODUCTS, response.status, {
        id: response.data.data.id,
        name: response.data.data.name,
      });

      return response.data.data;
    } catch (error) {
      logger.api.error('POST', ENDPOINTS.ADMIN_PRODUCTS, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Atualiza produto existente (admin)
   */
  async updateProduct(
    id: string,
    data: UpdateProductDTO
  ): Promise<ProductResponse> {
    try {
      const response = await api.put(ENDPOINTS.ADMIN_PRODUCT_BY_ID(id), data);
      
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Deleta produto (soft delete - admin)
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(ENDPOINTS.ADMIN_PRODUCT_BY_ID(id));
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Duplica produto (admin)
   */
  async duplicateProduct(id: string): Promise<ProductResponse> {
    try {
      // Buscar produto original
      const original = await this.getProductById(id);
      
      // Criar cópia com dados modificados
      const duplicate: CreateProductDTO = {
        name: `${original.name} (Cópia)`,
        slug: `${original.slug}-copia-${Date.now()}`,
        price: original.price,
        comparePrice: original.comparePrice || undefined,
        stock: 0, // Zerar estoque da cópia
        sku: original.sku ? `${original.sku}-COPY` : undefined,
        category: original.category || undefined,
        collectionId: original.collection?.id,
        gender: original.gender,
        isFeatured: false, // Não destacar cópia
        isActive: false, // Inativar cópia por padrão
        details: original.details ? {
          description: original.details.description || undefined,
          specifications: original.details.specifications || undefined,
        } : undefined,
        dimensions: original.dimensions || undefined,
        seo: original.seo ? {
          metaTitle: original.seo.metaTitle || undefined,
          metaDescription: original.seo.metaDescription || undefined,
          keywords: original.seo.keywords || undefined,
        } : undefined,
        images: original.images?.map(img => ({
          url: img.url,
          altText: img.altText || undefined,
          order: img.order,
          isPrimary: img.isPrimary,
        })),
        variants: original.variants?.map(v => ({
          size: v.size,
          color: v.color || undefined,
          colorHex: v.colorHex || undefined,
          sku: v.sku ? `${v.sku}-COPY` : undefined,
          stock: 0, // Zerar estoque das variantes
          priceAdjustment: v.priceAdjustment || undefined,
        })),
      };
      
      return await this.createProduct(duplicate);
    } catch (error) {
      console.error(`Erro ao duplicar produto ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  // ========== IMAGE OPERATIONS ==========
  
  /**
   * Upload de múltiplas imagens
   */
  async uploadImages(
    productId: string,
    files: File[],
    onProgress?: (progress: ImageUploadProgress[]) => void
  ): Promise<string[]> {
    try {
      const formData = new FormData();
      
      // Adicionar todos os arquivos ao FormData
      files.forEach((file) => {
        formData.append('images', file);
      });
      
      // Configurar progresso se callback fornecido
      const config = onProgress ? {
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          
          // Atualizar progresso de todos os arquivos igualmente
          const progressData: ImageUploadProgress[] = files.map((file) => ({
            fileName: file.name,
            progress: percentCompleted,
            uploaded: percentCompleted === 100,
          }));
          
          onProgress(progressData);
        },
      } : {};
      
      const response = await withRetry(
        () => api.post(ENDPOINTS.ADMIN_PRODUCT_IMAGES(productId), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          ...config,
        }),
        'uploadImages'
      );
      
      // Retornar URLs das imagens enviadas
      const uploadedImages = response.data.data.uploadedImages || [];
      return uploadedImages.map((img: any) => img.url);
      
    } catch (error) {
      console.error('Erro ao fazer upload de imagens:', error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Remove uma imagem de um produto
   */
  async deleteImage(productId: string, imageId: string): Promise<void> {
    try {
      await api.delete(ENDPOINTS.ADMIN_PRODUCT_IMAGE(productId, imageId));
    } catch (error) {
      console.error(`Erro ao deletar imagem ${imageId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  // ========== BULK OPERATIONS ==========
  
  /**
   * Ativa múltiplos produtos
   */
  async bulkActivate(productIds: string[]): Promise<BulkActionResult> {
    const results: BulkActionResult = {
      success: 0,
      failed: 0,
      errors: [],
    };
    
    for (const id of productIds) {
      try {
        await this.updateProduct(id, { isActive: true });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors?.push({
          id,
          message: getErrorMessage(error),
        });
      }
    }
    
    return results;
  }
  
  /**
   * Desativa múltiplos produtos
   */
  async bulkDeactivate(productIds: string[]): Promise<BulkActionResult> {
    const results: BulkActionResult = {
      success: 0,
      failed: 0,
      errors: [],
    };
    
    for (const id of productIds) {
      try {
        await this.updateProduct(id, { isActive: false });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors?.push({
          id,
          message: getErrorMessage(error),
        });
      }
    }
    
    return results;
  }
  
  /**
   * Deleta múltiplos produtos
   */
  async bulkDelete(productIds: string[]): Promise<BulkActionResult> {
    const results: BulkActionResult = {
      success: 0,
      failed: 0,
      errors: [],
    };
    
    for (const id of productIds) {
      try {
        await this.deleteProduct(id);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors?.push({
          id,
          message: getErrorMessage(error),
        });
      }
    }
    
    return results;
  }
  
  // ========== UTILITY OPERATIONS ==========
  
  /**
   * Verifica se slug está disponível
   * (Nota: endpoint precisa ser implementado no backend)
   */
  async checkSlugAvailability(slug: string): Promise<CheckSlugResponse> {
    try {
      // Por enquanto, simular verificação
      // TODO: Implementar endpoint no backend
      const products = await this.getProducts({ search: slug }, { limit: 1 });
      
      const isAvailable = products.data.length === 0 || 
                         products.data[0].slug !== slug;
      
      return {
        available: isAvailable,
        suggestion: isAvailable ? undefined : `${slug}-${Date.now()}`,
      };
    } catch (error) {
      console.error('Erro ao verificar slug:', error);
      // Em caso de erro, assumir disponível para não bloquear usuário
      return { available: true };
    }
  }
  
  /**
   * Busca estatísticas de produtos (admin)
   * (Nota: endpoint precisa ser implementado no backend)
   */
  async getProductStats(): Promise<ProductStats> {
    try {
      // Por enquanto, calcular a partir da listagem
      // TODO: Implementar endpoint otimizado no backend
      const [all, active, outOfStock, featured] = await Promise.all([
        this.getProducts({}, { limit: 1 }),
        this.getProducts({ isActive: true }, { limit: 1 }),
        this.getProducts({}, { limit: 1000 }), // Para contar sem estoque
        this.getProducts({ isFeatured: true }, { limit: 1 }),
      ]);
      
      const noStock = outOfStock.data.filter(p => p.stock === 0).length;
      
      return {
        total: all.pagination.total,
        active: active.pagination.total,
        outOfStock: noStock,
        featured: featured.pagination.total,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  // ========== COLLECTION OPERATIONS ==========
  
  /**
   * Lista todas as coleções
   */
  async getCollections(): Promise<CollectionResponse[]> {
    try {
      const response = await withRetry(
        () => api.get(ENDPOINTS.COLLECTIONS),
        'getCollections'
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Busca coleção por slug
   */
  async getCollectionBySlug(slug: string): Promise<CollectionResponse> {
    try {
      const response = await withRetry(
        () => api.get(ENDPOINTS.COLLECTION_BY_SLUG(slug)),
        'getCollectionBySlug'
      );
      
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar coleção ${slug}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Cria nova coleção (admin)
   */
  async createCollection(data: CreateCollectionDTO): Promise<CollectionResponse> {
    try {
      const response = await api.post(ENDPOINTS.ADMIN_COLLECTIONS, data);
      
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar coleção:', error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Atualiza coleção (admin)
   */
  async updateCollection(
    id: string,
    data: UpdateCollectionDTO
  ): Promise<CollectionResponse> {
    try {
      const response = await api.put(
        ENDPOINTS.ADMIN_COLLECTION_BY_ID(id),
        data
      );
      
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao atualizar coleção ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
  
  /**
   * Deleta coleção (admin)
   */
  async deleteCollection(id: string): Promise<void> {
    try {
      await api.delete(ENDPOINTS.ADMIN_COLLECTION_BY_ID(id));
    } catch (error) {
      console.error(`Erro ao deletar coleção ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
}

// Exportar instância única (Singleton)
export const productService = new ProductService();

// Exportar classe para testes
export default ProductService;
