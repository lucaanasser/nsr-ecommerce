import { useCallback } from 'react';
import {
  SizeOption,
  ColorOption,
  ProductVariant,
  generateVariantSku,
} from '../types/variant.types';

/**
 * Hook para gerenciamento de variantes
 * Gera automaticamente variantes baseado em tamanhos e cores
 */
export function useVariants(baseSku?: string) {
  /**
   * Gera variantes baseado em tamanhos e cores selecionados
   */
  const generateVariants = useCallback(
    (
      sizes: SizeOption[],
      colors: ColorOption[],
      hasColors: boolean
    ): ProductVariant[] => {
      const variants: ProductVariant[] = [];

      // Se não há tamanhos selecionados, retornar array vazio
      if (sizes.length === 0) {
        return variants;
      }

      if (hasColors && colors.length > 0) {
        // Gerar combinações tamanho × cor
        sizes.forEach((size) => {
          colors.forEach((color) => {
            variants.push({
              id: `${size.value}-${color.id}`,
              size: size.value,
              sizeLabel: size.label,
              color: color.id,
              colorName: color.name,
              colorHex: color.hex,
              stock: 0,
              sku: generateVariantSku(baseSku || '', size.value, color.id),
              priceAdjustment: 0,
              isActive: true,
            });
          });
        });
      } else {
        // Apenas tamanhos (sem cores)
        sizes.forEach((size) => {
          variants.push({
            id: size.value,
            size: size.value,
            sizeLabel: size.label,
            stock: 0,
            sku: generateVariantSku(baseSku || '', size.value),
            priceAdjustment: 0,
            isActive: true,
          });
        });
      }

      return variants;
    },
    [baseSku]
  );

  /**
   * Preserva os estoques existentes ao regenerar variantes
   */
  const mergeVariantStocks = useCallback(
    (
      newVariants: ProductVariant[],
      oldVariants: ProductVariant[]
    ): ProductVariant[] => {
      return newVariants.map((newVariant) => {
        // Procurar variante correspondente nas antigas
        const oldVariant = oldVariants.find(
          (old) =>
            old.size === newVariant.size &&
            old.color === newVariant.color
        );

        // Se encontrou, preservar o estoque e ajustes
        if (oldVariant) {
          return {
            ...newVariant,
            stock: oldVariant.stock,
            priceAdjustment: oldVariant.priceAdjustment,
            isActive: oldVariant.isActive,
          };
        }

        return newVariant;
      });
    },
    []
  );

  /**
   * Atualiza uma variante específica
   */
  const updateVariant = useCallback(
    (
      variants: ProductVariant[],
      variantId: string,
      updates: Partial<ProductVariant>
    ): ProductVariant[] => {
      return variants.map((variant) =>
        variant.id === variantId ? { ...variant, ...updates } : variant
      );
    },
    []
  );

  /**
   * Valida se há variantes duplicadas
   */
  const hasDuplicates = useCallback((variants: ProductVariant[]): boolean => {
    const keys = variants.map(
      (v) => `${v.size}-${v.color || 'no-color'}`
    );
    return new Set(keys).size !== keys.length;
  }, []);

  return {
    generateVariants,
    mergeVariantStocks,
    updateVariant,
    hasDuplicates,
  };
}
