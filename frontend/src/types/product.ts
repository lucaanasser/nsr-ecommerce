/**
 * Tipos e interfaces para produtos
 * Sincronizado com backend API types
 */

// ================================
// ENUMS
// ================================

export type Gender = 'MALE' | 'FEMALE' | 'UNISEX';

export type OrderBy = 
  | 'price_asc' 
  | 'price_desc' 
  | 'newest' 
  | 'popular' 
  | 'name_asc' 
  | 'name_desc';

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

export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: OrderBy;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
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
    id?: string;
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

// ================================
// RESPONSE TYPES
// ================================

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
  colorHex: string | null;
  sku: string | null;
  stock: number;
  priceAdjustment: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetails {
  description: string | null;
  specifications: string | null;
}

export interface ProductDimensions {
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface ProductSEO {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
}

export interface ProductCollection {
  id: string;
  name: string;
  slug: string;
}

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
  createdAt: string;
  updatedAt: string;
  
  // Related data
  details?: ProductDetails | null;
  dimensions?: ProductDimensions | null;
  seo?: ProductSEO | null;
  images?: ProductImage[];
  collection?: ProductCollection | null;
  variants?: ProductVariant[];
}

// ================================
// COLLECTION TYPES
// ================================

export interface CreateCollectionDTO {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateCollectionDTO {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface CollectionResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

// ================================
// IMAGE UPLOAD TYPES
// ================================

export interface ImageUploadResponse {
  url: string;
  altText?: string;
  order: number;
  isPrimary: boolean;
}

export interface ImageUploadProgress {
  fileName: string;
  progress: number;
  uploaded: boolean;
  error?: string;
  url?: string;
}

// ================================
// API RESPONSE TYPES
// ================================

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: Array<{ field: string; message: string }>;
  statusCode: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ================================
// TYPE GUARDS
// ================================

export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

// ================================
// UTILITY TYPES
// ================================

export interface ProductStats {
  total: number;
  active: number;
  outOfStock: number;
  featured: number;
}

export interface CheckSlugResponse {
  available: boolean;
  suggestion?: string;
}

export interface BulkActionResult {
  success: number;
  failed: number;
  errors?: Array<{ id: string; message: string }>;
}
