import api, { ApiResponse } from './api';

// Tipos de carrinho
export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: Array<{ url: string; alt?: string }>;
  };
  quantity: number;
  size: string;
  color?: string;
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  couponCode?: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  size: string;
  color?: string;
}

export interface UpdateCartItemData {
  quantity: number;
}

// Serviço de carrinho
export const cartService = {
  // Obter carrinho do usuário
  async getCart(): Promise<Cart> {
    const response = await api.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  // Adicionar item ao carrinho
  async addItem(data: AddToCartData): Promise<Cart> {
    const response = await api.post<ApiResponse<Cart>>('/cart/items', data);
    return response.data.data;
  },

  // Atualizar quantidade de item
  async updateItem(itemId: string, data: UpdateCartItemData): Promise<Cart> {
    const response = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, data);
    return response.data.data;
  },

  // Remover item do carrinho
  async removeItem(itemId: string): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return response.data.data;
  },

  // Limpar carrinho
  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },

  // Aplicar cupom
  async applyCoupon(code: string): Promise<Cart> {
    const response = await api.post<ApiResponse<Cart>>('/cart/coupon', { code });
    return response.data.data;
  },

  // Remover cupom
  async removeCoupon(): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>('/cart/coupon');
    return response.data.data;
  },
};
