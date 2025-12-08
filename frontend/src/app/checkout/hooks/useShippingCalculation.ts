/**
 * Hook customizado para gerenciar cálculo de frete
 * Integra com a API de shipping e gerencia estado de métodos disponíveis
 */

import { useState, useCallback } from 'react';
import { shippingService } from '@/services';
import type { CartItem } from '@/context/CartContext';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  isFree: boolean;
}

interface UseShippingCalculationResult {
  metodosDisponiveis: ShippingMethod[];
  calculando: boolean;
  erro: string | null;
  calcularFrete: (cep: string, items: CartItem[], cartTotal: number) => Promise<void>;
  limparFrete: () => void;
}

export function useShippingCalculation(): UseShippingCalculationResult {
  const [metodosDisponiveis, setMetodosDisponiveis] = useState<ShippingMethod[]>([]);
  const [calculando, setCalculando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const calcularFrete = useCallback(async (
    cep: string,
    items: CartItem[],
    cartTotal: number
  ) => {
    // Validar CEP
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setErro('CEP inválido');
      return;
    }

    // Validar itens
    if (items.length === 0) {
      setErro('Carrinho vazio');
      return;
    }

    setCalculando(true);
    setErro(null);
    setMetodosDisponiveis([]);

    try {
      // Preparar dados para API
      const requestData = {
        zipCode: cepLimpo,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        cartTotal: cartTotal
      };

      // Chamar API de cálculo de frete
      const response = await shippingService.calculateShipping(requestData);
      
      // Processar resposta
      if (response && response.methods) {
        const metodosFormatados = response.methods.map((method: any) => ({
          id: method.id,
          name: method.name,
          description: method.description || '',
          cost: method.cost,
          estimatedDays: method.estimatedDays,
          isFree: method.isFree || method.cost === 0
        }));

        setMetodosDisponiveis(metodosFormatados);
      } else {
        throw new Error('Resposta inválida da API de frete');
      }
    } catch (error: any) {
      console.error('Erro ao calcular frete:', error);
      const mensagemErro = error.response?.data?.message 
        || error.message 
        || 'Erro ao calcular frete. Tente novamente.';
      setErro(mensagemErro);
      setMetodosDisponiveis([]);
    } finally {
      setCalculando(false);
    }
  }, []);

  const limparFrete = useCallback(() => {
    setMetodosDisponiveis([]);
    setErro(null);
    setCalculando(false);
  }, []);

  return {
    metodosDisponiveis,
    calculando,
    erro,
    calcularFrete,
    limparFrete,
  };
}
