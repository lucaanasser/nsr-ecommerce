/**
 * Tipos e interfaces para criação, resposta e itens de pedidos.
 * Inclui DTOs, respostas e estrutura dos itens do pedido.
 */
export interface CreateOrderDTO {
  addressId: string;
  items: OrderItemInput[];
  shippingMethodId: string;
  couponCode?: string;
  paymentMethod: 'credit_card' | 'pix';
  notes?: string;
  
  // Dados opcionais do destinatário (quando diferente do comprador)
  receiverName?: string;
  receiverPhone?: string;
  
  // Dados de pagamento (apenas para cartão de crédito)
  creditCard?: {
    encrypted: string; // Dados do cartão criptografados pelo frontend
    holderName: string;
    holderCpf: string;
  };
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  items: OrderItemResponse[];
  createdAt: Date;
}

export interface OrderItemResponse {
  id: string;
  productName: string;
  productImage?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}
