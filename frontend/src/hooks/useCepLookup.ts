/**
 * Hook para busca automática de endereço por CEP
 * Utiliza a API do ViaCEP para preencher automaticamente os campos de endereço
 */

import { useState } from 'react';
import { cleanCep, isValidCep } from '@/utils/cep';

export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface UseCepLookupReturn {
  loading: boolean;
  error: string | null;
  lookupCep: (cep: string) => Promise<CepData | null>;
}

export function useCepLookup(): UseCepLookupReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupCep = async (cep: string): Promise<CepData | null> => {
    // Remove caracteres não numéricos
    const cleanedCep = cleanCep(cep);

    // Valida se o CEP tem 8 dígitos
    if (!isValidCep(cep)) {
      setError('CEP inválido');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar CEP');
      }

      const data: CepData = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return data;
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      setError('Erro ao buscar CEP. Tente novamente.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    lookupCep,
  };
}
