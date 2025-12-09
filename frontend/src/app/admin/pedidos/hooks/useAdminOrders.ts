import { useState, useEffect, useCallback } from 'react';
import { orderService, Order, AdminOrderFilters } from '@/services/order.service';

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AdminOrderFilters>({
    page: 1,
    limit: 10,
    status: '',
    search: '',
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAdminOrders(filters);
      setOrders(response.data);
      setTotal(response.meta.total);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      fetchOrders();
      return true;
    } catch (err) {
      console.error('Error updating status:', err);
      return false;
    }
  };

  const handleFilterChange = (newFilters: Partial<AdminOrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    orders,
    loading,
    error,
    total,
    filters,
    updateStatus,
    handleFilterChange,
    handlePageChange,
    refresh: fetchOrders
  };
}
