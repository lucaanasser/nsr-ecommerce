/**
 * Hook para gerenciar endereços salvos do usuário
 */

import { useState, useEffect } from 'react';
import { addressService } from '@/services';
import type { SavedAddress } from '@/services';

export function useSavedAddresses(isAuthenticated: boolean) {
  const [enderecosSalvos, setEnderecosSalvos] = useState<SavedAddress[]>([]);
  const [carregandoEnderecos, setCarregandoEnderecos] = useState(false);

  const carregarEnderecos = async () => {
    if (!isAuthenticated) return;

    setCarregandoEnderecos(true);
    try {
      const enderecos = await addressService.getAddresses();
      setEnderecosSalvos(enderecos);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setCarregandoEnderecos(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      carregarEnderecos();
    }
  }, [isAuthenticated]);

  return {
    enderecosSalvos,
    carregandoEnderecos,
    carregarEnderecos,
  };
}
