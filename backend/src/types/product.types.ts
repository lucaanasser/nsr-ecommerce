/**
 * Tipos e interfaces para produtos, categorias, coleções, filtros e paginação.
 * Inclui DTOs, respostas, variantes e estrutura de filtros.
 */
import { Gender } from '@prisma/client';

// ================================
// FILTERS & PAGINATION
// ================================

export interface ProductFilters {
  search?: string;
  category?: string;
  collectionId?: string;
  gender?: Gender;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  orderBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'name_asc' | 'name_desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ================================
// PRODUCT DTOs
// ================================

export interface CreateProductDTO {
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  category?: string;
  collectionId?: string;
  gender?: Gender;
  isFeatured?: boolean;
  isActive?: boolean;
  
  // Nested objects
  details?: {
    description?: string;
    specifications?: string;
  };
  
  dimensions?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  
  images?: Array<{
    url: string;
    altText?: string;
    order?: number;
    isPrimary?: boolean;
  }>;
  
  variants?: Array<{
    size: string;
    color?: string;
    colorHex?: string;
    sku?: string;
    stock: number;
    priceAdjustment?: number;
  }>;
}

export interface UpdateProductDTO {
  name?: string;
  slug?: string;
  price?: number;
  comparePrice?: number;
  stock?: number;
  sku?: string;
  category?: string;
  collectionId?: string;
  gender?: Gender;
  isFeatured?: boolean;
  isActive?: boolean;
  
  // Nested objects
  details?: {
    description?: string;
    specifications?: string;
  };
  
  dimensions?: {
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
  };
  
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  
  images?: Array<{
    id?: string; // For update/delete
    url: string;
    altText?: string;
    order?: number;
    isPrimary?: boolean;
  }>;
}

// ================================
// VARIANT DTOs
// ================================

export interface CreateVariantDTO {
  size: string;
  color?: string;
  colorHex?: string;
  sku?: string;
  stock: number;
  priceAdjustment?: number;
}

export interface UpdateVariantDTO {
  size?: string;
  color?: string;
  colorHex?: string;
  sku?: string;
  stock?: number;
  priceAdjustment?: number;
}

// ================================
// COLLECTION DTOs
// ================================

export interface CreateCollectionDTO {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface UpdateCollectionDTO {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
}

// ================================
// RESPONSE TYPES
// ================================

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  sku: string | null;
  category: string | null;
  gender: Gender;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
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
  
  images?: Array<{
    id: string;
    url: string;
    altText: string | null;
    order: number;
    isPrimary: boolean;
  }>;
  
  collection?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  
  variants?: VariantResponse[];
}

export interface VariantResponse {
  id: string;
  size: string;
  color: string | null;
  sku: string | null;
  stock: number;
  price: number | null;
  comparePrice: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
}
