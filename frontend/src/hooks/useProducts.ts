/**
 * Hook customizado para buscar produtos do backend
 * Suporta filtros dinâmicos e estados de loading/error
 */
import { useState, useEffect } from 'react';
import { productService, Product, ProductFilters } from '@/services/product.service';

interface UseProductsOptions {
  category?: string;
  gender?: 'MALE' | 'FEMALE' | 'UNISEX';
  isActive?: boolean;
  isFeatured?: boolean;
  autoFetch?: boolean; // Se false, não busca automaticamente
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para buscar produtos da API
 * 
 * @example
 * // Buscar todos produtos ativos
 * const { products, isLoading, error } = useProducts();
 * 
 * @example
 * // Buscar produtos de uma categoria específica
 * const { products, isLoading, error } = useProducts({ category: 'camiseta' });
 * 
 * @example
 * // Buscar produtos featured
 * const { products, isLoading, error } = useProducts({ isFeatured: true });
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const {
    category,
    gender,
    isActive = true, // Por padrão, apenas produtos ativos
    isFeatured,
    autoFetch = true,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Montar filtros para a API
      const filters: ProductFilters = {
        isActive,
      };

      if (category) filters.category = category;
      if (gender) filters.gender = gender;
      if (isFeatured !== undefined) filters.featured = isFeatured;

      // Buscar produtos
      const result = await productService.getProducts(filters);
      setProducts(result.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Erro ao carregar produtos. Tente novamente.');
      setProducts([]); // Limpa produtos em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar produtos automaticamente quando as dependências mudarem
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, gender, isActive, isFeatured, autoFetch]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}
