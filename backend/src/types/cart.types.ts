/**
 * Tipos e interfaces para operações, respostas e validações do carrinho de compras.
 * Inclui DTOs, respostas, validação e estrutura dos itens do carrinho.
 */
/**
 * Cart Types
 * Tipos e interfaces para o carrinho de compras
 */

// ================================
// DTOs (Data Transfer Objects)
// ================================

/**
 * Dados para adicionar item ao carrinho
 */
export interface AddItemDTO {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

/**
 * Dados para atualizar item do carrinho
 */
export interface UpdateItemDTO {
  quantity: number;
}

// ================================
// Response Types
// ================================

/**
 * Produto simplificado no item do carrinho
 */
export interface CartProductInfo {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  isActive: boolean;
}

/**
 * Item individual do carrinho
 */
export interface CartItemResponse {
  id: string;
  productId: string;
  product: CartProductInfo;
  size: string;
  color: string;
  quantity: number;
  subtotal: number;
}

/**
 * Resumo do carrinho (totais)
 */
export interface CartSummary {
  subtotal: number;
  itemCount: number;      // Quantidade de linhas únicas
  totalQuantity: number;  // Soma de todas as quantidades
}

/**
 * Resposta completa do carrinho
 */
export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
  summary: CartSummary;
  createdAt: Date;
  updatedAt: Date;
}

// ================================
// Validation Types
// ================================

/**
 * Item inválido no carrinho
 */
export interface InvalidCartItem {
  itemId: string;
  productName: string;
  reason: string;
}

/**
 * Resultado da validação do carrinho
 */
export interface CartValidationResult {
  valid: boolean;
  invalidItems: InvalidCartItem[];
}

/**
 * Resultado da validação de estoque
 */
export interface StockValidationResult {
  available: boolean;
  requested: number;
  inStock: number;
  productName: string;
}
