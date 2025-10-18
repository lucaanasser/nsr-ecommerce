import api, { ApiResponse, PaginatedResponse } from './api';

// Tipos de produto
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  collectionId?: string;
  collection?: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  featured: boolean;
  isNew: boolean;
  stock: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color?: string;
  stock: number;
  sku?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
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
};
