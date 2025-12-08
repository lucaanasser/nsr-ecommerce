import { useState, useEffect } from 'react';
import { productService, Product } from '@/services/product.service';

/**
 * Hook para buscar um produto específico por slug
 */
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}
