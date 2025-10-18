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
  cep: string;
  weight?: number;
  volume?: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  price: number;
  active: boolean;
}

// Serviço de frete
export const shippingService = {
  // Calcular frete
  async calculateShipping(data: CalculateShippingData): Promise<ShippingOption[]> {
    const response = await api.post<ApiResponse<{ options: ShippingOption[] }>>('/shipping/calculate', data);
    return response.data.data.options;
  },

  // Listar métodos de envio disponíveis
  async getShippingMethods(): Promise<ShippingMethod[]> {
    const response = await api.get<ApiResponse<ShippingMethod[]>>('/shipping/methods');
    return response.data.data;
  },
};
