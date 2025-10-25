import { useEffect } from 'react';
import { ProductFormData } from '../../hooks/useProductForm';
import { useVariants } from '../../hooks/useVariants';
import { VariantConfig } from '../../types/variant.types';
import SizeSelector from '../variants/SizeSelector';
import ColorToggle from '../variants/ColorToggle';
import ColorSelector from '../variants/ColorSelector';
import VariantGrid from '../variants/VariantGrid';
import VariantSummary from '../variants/VariantSummary';

interface VariantsStepProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  onUpdateField: <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => void;
}

/**
 * Step 4: Tamanhos e Cores (Variantes)
 * Orquestra todos os componentes de variantes
 */
export default function VariantsStep({
  formData,
  errors,
  onUpdateField,
}: VariantsStepProps) {
  const { sizeType, sizes, hasColors, colors, variants } = formData.variantConfig;
  const { generateVariants, mergeVariantStocks } = useVariants(formData.sku);

  // Atualizar configuração de variantes
  const updateVariantConfig = (updates: Partial<VariantConfig>) => {
    onUpdateField('variantConfig', {
      ...formData.variantConfig,
      ...updates,
    });
  };

  // Auto-gerar variantes quando tamanhos ou cores mudam
  useEffect(() => {
    if (sizes.length === 0) {
      updateVariantConfig({ variants: [] });
      return;
    }

    const newVariants = generateVariants(sizes, hasColors ? colors : [], hasColors);
    
    // Preservar estoques existentes ao regenerar
    const mergedVariants = mergeVariantStocks(newVariants, variants);
    
    updateVariantConfig({ variants: mergedVariants });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes, colors, hasColors, generateVariants, mergeVariantStocks]);

  // Atualizar uma variante específica
  const handleUpdateVariant = (id: string, updates: any) => {
    const updatedVariants = variants.map((v) =>
      v.id === id ? { ...v, ...updates } : v
    );
    updateVariantConfig({ variants: updatedVariants });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-primary-white mb-2">
          Tamanhos e Cores
        </h3>
        <p className="text-sm text-primary-white/60">
          Configure as variantes do produto (tamanhos × cores) e defina o estoque para cada uma
        </p>
      </div>

      {/* Seletor de Tamanhos */}
      <SizeSelector
        sizeType={sizeType}
        sizes={sizes}
        onSizeTypeChange={(type) => updateVariantConfig({ sizeType: type })}
        onSizesChange={(newSizes) => updateVariantConfig({ sizes: newSizes })}
      />
      {errors.sizes && (
        <p className="text-sm text-red-500 mt-2">❌ {errors.sizes}</p>
      )}

      {/* Toggle de Cores */}
      <ColorToggle
        hasColors={hasColors}
        onChange={(enabled) => updateVariantConfig({ hasColors: enabled, colors: enabled ? colors : [] })}
      />

      {/* Seletor de Cores (condicional) */}
      {hasColors && (
        <>
          <ColorSelector
            colors={colors}
            onColorsChange={(newColors) => updateVariantConfig({ colors: newColors })}
          />
          {errors.colors && (
            <p className="text-sm text-red-500 mt-2">❌ {errors.colors}</p>
          )}
        </>
      )}

      {/* Grid de Estoque */}
      {variants.length > 0 && (
        <>
          <div className="border-t border-dark-border pt-6">
            <VariantGrid
              variants={variants}
              onUpdateVariant={handleUpdateVariant}
            />
          </div>
          {errors.variantStock && (
            <p className="text-sm text-red-500 mt-2">❌ {errors.variantStock}</p>
          )}
          {errors.variants && (
            <p className="text-sm text-red-500 mt-2">❌ {errors.variants}</p>
          )}
        </>
      )}

      {/* Resumo Estatístico */}
      {variants.length > 0 && (
        <div className="border-t border-dark-border pt-6">
          <VariantSummary
            variants={variants}
            basePrice={formData.price}
          />
        </div>
      )}
    </div>
  );
}
