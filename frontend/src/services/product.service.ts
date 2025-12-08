import api, { ApiResponse, PaginatedResponse } from './api';

// Tipos de produto (alinhados com o backend)
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  sku: string | null;
  category: string | null;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  details?: {
    description: string | null;
    specifications: string | null;
  } | null;
  
  dimensions?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  } | null;
  
  seo?: {
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string[];
  } | null;
  
  images?: ProductImage[];
  
  collection?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  order: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string | null;
  sku: string | null;
  stock: number;
  price: number | null;
  comparePrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  collection?: string;
  gender?: 'MALE' | 'FEMALE' | 'UNISEX';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  isActive?: boolean;
  new?: boolean;
  sizes?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Serviço de produtos
export const productService = {
  // Listar produtos com filtros
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: filters,
    });
    return response.data;
  },

  // Obter produtos em destaque
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/products/featured');
    return response.data.data;
  },

  // Obter produto por slug
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return response.data.data;
  },

  // Buscar produtos (alias para getProducts com search)
  async searchProducts(searchTerm: string, filters?: Omit<ProductFilters, 'search'>): Promise<PaginatedResponse<Product>> {
    return this.getProducts({
      ...filters,
      search: searchTerm,
    });
  },

  // ========== ADMIN ENDPOINTS ==========

  // Listar todos os produtos (incluindo inativos) - ADMIN
  async getAdminProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/admin/products', {
      params: filters,
    });
    return response.data;
  },

  // Obter produto por ID - ADMIN
  async getAdminProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/admin/products/${id}`);
    return response.data.data;
  },

  // Criar produto - ADMIN
  async createProduct(data: any): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/admin/products', data);
    return response.data.data;
  },

  // Atualizar produto - ADMIN
  async updateProduct(id: string, data: any): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/admin/products/${id}`, data);
    return response.data.data;
  },

  // Deletar produto - ADMIN
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/admin/products/${id}`);
  },

  // Duplicar produto - ADMIN
  async duplicateProduct(id: string): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>(`/admin/products/${id}/duplicate`);
    return response.data.data;
  },

  // Ativar produtos em lote - ADMIN
  async bulkActivate(productIds: string[]): Promise<any> {
    const response = await api.patch('/admin/products/bulk/activate', { productIds });
    return response.data;
  },

  // Desativar produtos em lote - ADMIN
  async bulkDeactivate(productIds: string[]): Promise<any> {
    const response = await api.patch('/admin/products/bulk/deactivate', { productIds });
    return response.data;
  },

  // Deletar produtos em lote - ADMIN
  async bulkDelete(productIds: string[]): Promise<any> {
    const response = await api.delete('/admin/products/bulk', { data: { productIds } });
    return response.data;
  },
};
