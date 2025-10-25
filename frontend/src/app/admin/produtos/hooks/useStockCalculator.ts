import { useMemo } from 'react';
import { ProductVariant } from '../types/variant.types';

/**
 * Hook para cálculos relacionados ao estoque de variantes
 */
export function useStockCalculator(
  variants: ProductVariant[],
  basePrice: number
) {
  /**
   * Total de variantes configuradas
   */
  const totalVariants = variants.length;

  /**
   * Estoque total somado de todas as variantes
   */
  const totalStock = useMemo(() => {
    return variants.reduce((sum, variant) => sum + variant.stock, 0);
  }, [variants]);

  /**
   * Valor total em estoque (quantidade × preço)
   */
  const totalValue = useMemo(() => {
    return variants.reduce((sum, variant) => {
      const price = basePrice + (variant.priceAdjustment || 0);
      return sum + variant.stock * price;
    }, 0);
  }, [variants, basePrice]);

  /**
   * Variantes com estoque baixo (1-5 unidades)
   */
  const lowStockVariants = useMemo(() => {
    return variants.filter((v) => v.stock > 0 && v.stock <= 5);
  }, [variants]);

  /**
   * Variantes esgotadas (estoque = 0)
   */
  const outOfStockVariants = useMemo(() => {
    return variants.filter((v) => v.stock === 0);
  }, [variants]);

  /**
   * Variantes com estoque OK (> 5 unidades)
   */
  const inStockVariants = useMemo(() => {
    return variants.filter((v) => v.stock > 5);
  }, [variants]);

  /**
   * Status geral do estoque
   */
  const stockStatus = useMemo<'error' | 'warning' | 'success'>(() => {
    if (totalStock === 0) return 'error';
    if (totalStock < 20 || lowStockVariants.length > 0) return 'warning';
    return 'success';
  }, [totalStock, lowStockVariants]);

  /**
   * Percentual de variantes em estoque
   */
  const stockPercentage = useMemo(() => {
    if (totalVariants === 0) return 0;
    return (inStockVariants.length / totalVariants) * 100;
  }, [inStockVariants, totalVariants]);

  /**
   * Média de estoque por variante
   */
  const averageStock = useMemo(() => {
    if (totalVariants === 0) return 0;
    return totalStock / totalVariants;
  }, [totalStock, totalVariants]);

  /**
   * Verifica se há estoque insuficiente
   */
  const hasInsufficientStock = totalStock === 0 && totalVariants > 0;

  /**
   * Verifica se há alertas de estoque
   */
  const hasStockAlerts = lowStockVariants.length > 0 || outOfStockVariants.length > 0;

  /**
   * Conta total de alertas
   */
  const totalAlerts = lowStockVariants.length + outOfStockVariants.length;

  return {
    // Totais
    totalVariants,
    totalStock,
    totalValue,

    // Por categoria
    lowStockVariants,
    outOfStockVariants,
    inStockVariants,

    // Status
    stockStatus,
    hasInsufficientStock,
    hasStockAlerts,
    totalAlerts,

    // Métricas
    stockPercentage,
    averageStock,
  };
}
