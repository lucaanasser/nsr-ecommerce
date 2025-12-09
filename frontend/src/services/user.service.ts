import api, { ApiResponse, PaginatedResponse } from './api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
  ordersCount: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedUserResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const userService = {
  async getUsers(filters?: UserFilters): Promise<PaginatedUserResponse<User>> {
    const response = await api.get<PaginatedUserResponse<User>>('/admin/users', {
      params: filters,
    });
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return response.data.data;
  },
};
