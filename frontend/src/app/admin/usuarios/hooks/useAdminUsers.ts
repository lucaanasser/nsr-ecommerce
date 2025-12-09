import { useState, useEffect, useCallback } from 'react';
import { userService, User, UserFilters } from '@/services/user.service';

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    status: 'todos',
    search: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert 'todos' to undefined for API
      const apiFilters = {
        ...filters,
        status: filters.status === 'todos' ? undefined : filters.status
      };

      const response = await userService.getUsers(apiFilters);
      setUsers(response.data);
      setTotal(response.meta.total);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    users,
    loading,
    error,
    total,
    filters,
    handleFilterChange,
    handlePageChange,
    refresh: fetchUsers
  };
}
