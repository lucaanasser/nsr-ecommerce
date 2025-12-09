import api, { ApiResponse, PaginatedResponse } from './api';

// Tipos de pedido
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO';
  items: OrderItem[];
  subtotal: number | string;
  discount: number | string;
  shippingCost: number | string;
  total: number | string;
  shippingAddress: Address;
  shippingMethod: string;
  trackingCode?: string;
  couponCode?: string;
  payment?: OrderPayment;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ url: string }>;
  };
  quantity: number;
  size: string;
  color?: string;
  unitPrice: number | string;
  totalPrice: number | string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderData {
  addressId: string;
  items: Array<{
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  shippingMethodId: string;
  paymentMethod: 'credit_card' | 'pix';
  couponCode?: string;
  receiverName?: string;
  receiverPhone?: string;
  notes?: string;
  creditCard?: {
    encrypted: string;
    holderName: string;
    holderCpf: string;
  };
}

export interface OrderPayment {
  id: string;
  method: string;
  status: string;
  chargeId?: string;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  pixExpiresAt?: string;
}

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}

// Serviço de pedidos
export const orderService = {
  // Criar novo pedido
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data.data;
  },

  // Listar pedidos do usuário
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const response = await api.get<PaginatedResponse<Order>>('/orders', {
      params: filters,
    });
    return response.data;
  },

  // Obter pedido por ID
  async getOrderById(orderId: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data;
  },

  // Cancelar pedido
  async cancelOrder(orderId: string): Promise<Order> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
    return response.data.data;
  },
};
