import { useState, useEffect } from 'react';
import { addressService, Address } from '@/services/address.service';

/**
 * Hook personalizado para gerenciar endereços do usuário
 */
export function useAddresses(isActive: boolean, isAuthenticated: boolean) {
  const [enderecos, setEnderecos] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnderecos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await addressService.getAddresses();
      setEnderecos(result || []);
    } catch (err) {
      console.error('Erro ao buscar endereços:', err);
      setError('Erro ao carregar endereços');
      setEnderecos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isActive && isAuthenticated) {
      fetchEnderecos();
    }
  }, [isActive, isAuthenticated]);

  const createAddress = async (data: any) => {
    try {
      await addressService.createAddress(data);
      await fetchEnderecos();
    } catch (error: any) {
      console.error('Erro ao criar endereço:', error);
      throw error;
    }
  };

  const updateAddress = async (id: string, data: any) => {
    try {
      await addressService.updateAddress(id, data);
      await fetchEnderecos();
    } catch (error: any) {
      console.error('Erro ao atualizar endereço:', error);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await addressService.deleteAddress(id);
      await fetchEnderecos();
    } catch (error: any) {
      console.error('Erro ao deletar endereço:', error);
      throw error;
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      await addressService.setDefaultAddress(id);
      await fetchEnderecos();
    } catch (error: any) {
      console.error('Erro ao definir endereço padrão:', error);
      throw error;
    }
  };

  return {
    enderecos,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch: fetchEnderecos,
  };
}
