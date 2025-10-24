import api, { ApiResponse } from './api';

// Tipos de endereço
export interface Address {
  id: string;
  userId: string;
  label: string; // Ex: "Casa", "Trabalho", "Casa dos pais"
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  label: string; // Título do endereço
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}

// Serviço de endereços
export const addressService = {
  // Buscar todos os endereços do usuário
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<ApiResponse<Address[]>>('/user/addresses');
    return response.data.data;
  },

  // Buscar um endereço específico
  async getAddress(id: string): Promise<Address> {
    const response = await api.get<ApiResponse<Address>>(`/user/addresses/${id}`);
    return response.data.data;
  },

  // Criar novo endereço
  async createAddress(data: CreateAddressData): Promise<Address> {
    const response = await api.post<ApiResponse<Address>>('/user/addresses', data);
    return response.data.data;
  },

  // Atualizar endereço
  async updateAddress(id: string, data: UpdateAddressData): Promise<Address> {
    const response = await api.put<ApiResponse<Address>>(`/user/addresses/${id}`, data);
    return response.data.data;
  },

  // Deletar endereço
  async deleteAddress(id: string): Promise<void> {
    await api.delete(`/user/addresses/${id}`);
  },

  // Definir endereço como padrão
  async setDefaultAddress(id: string): Promise<Address> {
    const response = await api.patch<ApiResponse<Address>>(`/user/addresses/${id}/default`);
    return response.data.data;
  },
};
