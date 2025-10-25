import { useMemo } from 'react';
import { ProductVariant } from '../../types/variant.types';
import VariantCell from './VariantCell';

interface FullVariantMatrixProps {
  variants: ProductVariant[];
  onUpdate: (id: string, updates: Partial<ProductVariant>) => void;
}

/**
 * Matriz completa de variantes (Tamanhos × Cores)
 */
export default function FullVariantMatrix({ variants, onUpdate }: FullVariantMatrixProps) {
  // Organizar variantes em matriz
  const { sizes, colors, matrix } = useMemo(() => {
    const uniqueSizes = Array.from(new Set(variants.map((v) => v.size))).map((size) => {
      const variant = variants.find((v) => v.size === size)!;
      return { value: size, label: variant.sizeLabel };
    });

    const uniqueColors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))).map(
      (color) => {
        const variant = variants.find((v) => v.color === color)!;
        return {
          id: color!,
          name: variant.colorName!,
          hex: variant.colorHex!,
        };
      }
    );

    const matrixData: Record<string, Record<string, ProductVariant>> = {};

    variants.forEach((variant) => {
      if (!matrixData[variant.size]) {
        matrixData[variant.size] = {};
      }
      if (variant.color) {
        matrixData[variant.size][variant.color] = variant;
      }
    });

    return {
      sizes: uniqueSizes,
      colors: uniqueColors,
      matrix: matrixData,
    };
  }, [variants]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-primary-white">
        Estoque por Tamanho e Cor <span className="text-red-500">*</span>
      </label>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-dark-border rounded-sm">
          <thead>
            <tr className="bg-dark-card">
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-white/60 border-b border-r border-dark-border">
                Tamanho / Cor
              </th>
              {colors.map((color) => (
                <th
                  key={color.id}
                  className="px-4 py-3 text-center border-b border-r border-dark-border last:border-r-0"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-dark-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-semibold text-primary-white">
                      {color.name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizes.map((size, sizeIndex) => (
              <tr
                key={size.value}
                className={sizeIndex % 2 === 0 ? 'bg-dark-bg/30' : 'bg-dark-bg/10'}
              >
                <td className="px-4 py-3 font-semibold text-primary-white border-r border-dark-border">
                  {size.label}
                </td>
                {colors.map((color) => {
                  const variant = matrix[size.value]?.[color.id];
                  return (
                    <td
                      key={`${size.value}-${color.id}`}
                      className="px-2 py-2 border-r border-dark-border last:border-r-0"
                    >
                      {variant ? (
                        <VariantCell variant={variant} onUpdate={onUpdate} />
                      ) : (
                        <div className="text-center text-primary-white/30 text-sm">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-primary-gold/10 border border-primary-gold/30 rounded-sm">
        <p className="text-xs text-primary-gold">
          💡 Dica: A matriz mostra todas as combinações de tamanho × cor. Preencha o estoque para cada variante.
        </p>
      </div>
    </div>
  );
}
