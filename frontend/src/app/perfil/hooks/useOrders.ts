import { useState, useEffect } from 'react';
import { orderService } from '@/services';

/**
 * Hook personalizado para gerenciar pedidos do usuário
 */
export function useOrders(isActive: boolean, isAuthenticated: boolean) {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await orderService.getOrders();
        setPedidos(result.data || []);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        setError('Erro ao carregar pedidos');
        setPedidos([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isActive && isAuthenticated) {
      fetchPedidos();
    }
  }, [isActive, isAuthenticated]);

  return { pedidos, isLoading, error };
}
