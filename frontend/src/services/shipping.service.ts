import api, { ApiResponse } from './api';

// Tipos de frete
export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  carrier: string;
}

export interface CalculateShippingData {
  zipCode: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  cartTotal: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  isFree: boolean;
}

export interface ShippingCalculationResponse {
  methods: ShippingMethod[];
}

// Serviço de frete
export const shippingService = {
  // Calcular frete
  async calculateShipping(data: CalculateShippingData): Promise<ShippingCalculationResponse> {
    const response = await api.post<ApiResponse<ShippingCalculationResponse>>('/shipping/calculate', data);
    return response.data.data;
  },

  // Listar métodos de envio disponíveis
  async getShippingMethods(): Promise<ShippingMethod[]> {
    const response = await api.get<ApiResponse<ShippingMethod[]>>('/shipping/methods');
    return response.data.data;
  },
};
