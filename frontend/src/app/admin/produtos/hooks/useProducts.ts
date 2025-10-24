import { useState, useEffect } from 'react';

/**
 * Filtros para produtos
 */
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  collectionId?: string;
  gender?: 'masculino' | 'feminino' | 'unisex' | 'todos';
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
}

/**
 * Hook customizado para gerenciar produtos
 * Centraliza toda a lógica de estado e operações CRUD
 */
export function useProducts(initialFilters?: ProductFilters) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});

  // Função para buscar produtos (mockada por enquanto)
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Substituir por chamada real à API
      // const response = await productService.getProducts(filters);
      // setProducts(response.data);
      
      // Mockado temporariamente
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Importar produtos mockados
      const { products: mockProducts } = await import('@/data/products');
      
      // Aplicar filtros
      let filtered = mockProducts;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.gender && filters.gender !== 'todos') {
        filtered = filtered.filter(p => p.category === filters.gender);
      }
      
      setProducts(filtered);
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
    setFilters({});
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
