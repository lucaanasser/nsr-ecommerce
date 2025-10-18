export interface CreateOrderDTO {
  addressId: string;
  items: OrderItemInput[];
  shippingMethodId: string;
  couponCode?: string;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  notes?: string;
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
