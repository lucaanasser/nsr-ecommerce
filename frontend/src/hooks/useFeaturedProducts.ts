/**
 * Hook customizado para buscar produtos em destaque (featured)
 * Produtos featured sempre têm isActive=true
 */
import { useState, useEffect } from 'react';
import { productService, Product } from '@/services/product.service';

interface UseFeaturedProductsOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseFeaturedProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para buscar produtos em destaque (featured)
 * 
 * @example
 * // Buscar produtos featured (padrão: 10 produtos)
 * const { products, isLoading, error } = useFeaturedProducts();
 * 
 * @example
 * // Buscar 6 produtos featured
 * const { products, isLoading, error } = useFeaturedProducts({ limit: 6 });
 */
export function useFeaturedProducts(options: UseFeaturedProductsOptions = {}): UseFeaturedProductsReturn {
  const { limit, autoFetch = true } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar produtos featured do backend
      const data = await productService.getFeaturedProducts();
      
      // Aplicar limite se especificado
      const limitedData = limit ? data.slice(0, limit) : data;
      setProducts(limitedData);
    } catch (err) {
      console.error('Erro ao carregar produtos em destaque:', err);
      setError('Erro ao carregar novidades. Tente novamente.');
      setProducts([]); // Limpa produtos em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar produtos automaticamente quando as dependências mudarem
  useEffect(() => {
    if (autoFetch) {
      fetchFeaturedProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, autoFetch]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchFeaturedProducts,
  };
}
