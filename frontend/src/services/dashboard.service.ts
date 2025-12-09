import api, { ApiResponse } from './api';
import { Order } from './order.service';

export interface DashboardStats {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  orders: {
    total: number;
    monthly: number;
  };
  averageTicket: number;
  recentOrders: (Order & {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  })[];
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data.data;
  },
};
