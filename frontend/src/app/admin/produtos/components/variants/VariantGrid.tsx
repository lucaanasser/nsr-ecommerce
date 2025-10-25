import { ProductVariant } from '../../types/variant.types';
import SingleStockInput from './SingleStockInput';
import ColorStockList from './ColorStockList';
import SizeStockGrid from './SizeStockGrid';
import FullVariantMatrix from './FullVariantMatrix';

interface VariantGridProps {
  variants: ProductVariant[];
  onUpdateVariant: (id: string, updates: Partial<ProductVariant>) => void;
}

/**
 * Grid adaptativo de estoque
 * Detecta automaticamente qual tipo de input mostrar baseado nas variantes
 */
export default function VariantGrid({ variants, onUpdateVariant }: VariantGridProps) {
  // Detectar tipo de grid necessário
  const uniqueSize = variants.length > 0 && variants.every((v) => v.size === variants[0].size);
  const hasColors = variants.some((v) => v.color);
  const multipleSizes = new Set(variants.map((v) => v.size)).size > 1;

  // Nenhuma variante configurada
  if (variants.length === 0) {
    return (
      <div className="p-8 bg-dark-card/30 border border-dark-border rounded-sm text-center">
        <p className="text-sm text-primary-white/60">
          Configure os tamanhos acima para definir o estoque
        </p>
      </div>
    );
  }

  // Caso 1: Tamanho único sem cores
  if (uniqueSize && !hasColors) {
    return <SingleStockInput variant={variants[0]} onUpdate={onUpdateVariant} />;
  }

  // Caso 2: Tamanho único com cores
  if (uniqueSize && hasColors) {
    return <ColorStockList variants={variants} onUpdate={onUpdateVariant} />;
  }

  // Caso 3: Múltiplos tamanhos sem cores
  if (multipleSizes && !hasColors) {
    return <SizeStockGrid variants={variants} onUpdate={onUpdateVariant} />;
  }

  // Caso 4: Múltiplos tamanhos com cores (matriz completa)
  return <FullVariantMatrix variants={variants} onUpdate={onUpdateVariant} />;
}
