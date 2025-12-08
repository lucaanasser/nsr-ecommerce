import { useState, useEffect } from 'react';
import { productService, Product, ProductFilters as ApiProductFilters } from '@/services/product.service';

/**
 * Filtros para produtos (versão admin)
 */
export interface ProductFilters {
  search?: string;
  category?: string;
  collectionId?: string;
  gender?: 'MALE' | 'FEMALE' | 'UNISEX' | 'todos';
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
}

/**
 * Hook customizado para gerenciar produtos
 * Centraliza toda a lógica de estado e operações CRUD
 */
export function useProducts(initialFilters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || { gender: 'todos' });

  // Função para buscar produtos da API (usando endpoint ADMIN)
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Converter filtros para o formato da API (só enviar valores definidos)
      const apiFilters: ApiProductFilters = {};

      if (filters.search) apiFilters.search = filters.search;
      if (filters.category) apiFilters.category = filters.category;
      if (filters.collectionId) apiFilters.collection = filters.collectionId;
      if (filters.isFeatured !== undefined) apiFilters.featured = filters.isFeatured;
      if (filters.inStock !== undefined) apiFilters.inStock = filters.inStock;

      // Adicionar filtro de gênero apenas se não for 'todos'
      if (filters.gender && filters.gender !== 'todos') {
        // A API backend espera MALE, FEMALE, UNISEX
        apiFilters.gender = filters.gender;
      }
      
      // Usar endpoint ADMIN que não filtra por isActive
      const response = await productService.getAdminProducts(apiFilters);
      setProducts(response.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos');
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Recarregar quando filtros mudarem
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Atualizar filtros
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Resetar filtros
  const resetFilters = () => {
    setFilters({ gender: 'todos' });
  };

  return {
    products,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchProducts,
  };
}
