import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Product } from '@/services/product.service';

/**
 * Tabela de produtos reutilizável
 */
interface ProductTableProps {
  products: Product[];
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  // Seleção múltipla
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onSelectAll?: () => void;
  allSelected?: boolean;
  someSelected?: boolean;
}

export default function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  selectable = false,
  selectedIds = new Set(),
  onToggleSelection,
  onSelectAll,
  allSelected = false,
  someSelected = false,
}: ProductTableProps) {
  return (
    <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-bg/50">
            <tr className="border-b border-dark-border">
              {/* Checkbox de seleção */}
              {selectable && (
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someSelected;
                      }
                    }}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded border-dark-border bg-dark-bg text-primary-gold focus:ring-primary-gold cursor-pointer"
                  />
                </th>
              )}
              <th className="text-left text-sm font-medium text-primary-white/60 p-4">
                Produto
              </th>
              <th className="text-left text-sm font-medium text-primary-white/60 p-4">
                Categoria
              </th>
              <th className="text-left text-sm font-medium text-primary-white/60 p-4">
                Coleção
              </th>
              <th className="text-left text-sm font-medium text-primary-white/60 p-4">
                Preço
              </th>
              <th className="text-center text-sm font-medium text-primary-white/60 p-4">
                Status
              </th>
              <th className="text-right text-sm font-medium text-primary-white/60 p-4">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <ProductTableRow
                key={product.id}
                product={product}
                index={index}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                selectable={selectable}
                isSelected={selectedIds.has(product.id)}
                onToggleSelection={onToggleSelection}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Linha da tabela de produtos
 */
interface ProductTableRowProps {
  product: Product;
  index: number;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  selectable?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}

function ProductTableRow({
  product,
  index,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  selectable = false,
  isSelected = false,
  onToggleSelection,
}: ProductTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        border-b border-dark-border/50 hover:bg-dark-bg/30 transition-colors
        ${isSelected ? 'bg-primary-gold/5' : ''}
      `}
    >
      {/* Checkbox */}
      {selectable && (
        <td className="p-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection?.(product.id)}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-dark-border bg-dark-bg text-primary-gold focus:ring-primary-gold cursor-pointer"
          />
        </td>
      )}

      {/* Produto */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-dark-bg rounded-sm overflow-hidden flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-dark-border flex items-center justify-center text-primary-white/30 text-xs">
                Sem foto
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-primary-white">
              {product.name}
            </p>
            <p className="text-xs text-primary-white/50 line-clamp-1">
              {product.details?.description || 'Sem descrição'}
            </p>
          </div>
        </div>
      </td>

      {/* Categoria */}
      <td className="p-4">
        <span className="text-sm text-primary-white/80 capitalize">
          {product.category || 'Sem categoria'}
        </span>
      </td>

      {/* Coleção */}
      <td className="p-4">
        <span className="text-sm text-primary-white/60">
          {product.collection?.name || '-'}
        </span>
      </td>

      {/* Preço */}
      <td className="p-4">
        <span className="text-sm font-semibold text-primary-gold">
          R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </td>

      {/* Status */}
      <td className="p-4">
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {!product.isActive && (
            <span className="inline-block px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-sm">
              Inativo
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-block px-2 py-1 bg-primary-gold/10 border border-primary-gold/30 text-primary-gold text-xs rounded-sm">
              Destaque
            </span>
          )}
          {product.stock === 0 && (
            <span className="inline-block px-2 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs rounded-sm">
              Sem estoque
            </span>
          )}
        </div>
      </td>

      {/* Ações */}
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          {onView && (
            <Button 
              variant="ghost" 
              onClick={() => onView(product)}
              className="p-2 text-primary-white/60 hover:text-blue-500 hover:bg-blue-500/10" 
              title="Visualizar"
            >
              <Eye size={16} />
            </Button>
          )}
          {onEdit && (
            <Button 
              variant="ghost" 
              onClick={() => onEdit(product)}
              className="p-2 text-primary-white/60 hover:text-primary-gold hover:bg-primary-gold/10" 
              title="Editar"
            >
              <Edit size={16} />
            </Button>
          )}
          {onDuplicate && (
            <Button 
              variant="ghost" 
              onClick={() => onDuplicate(product)}
              className="p-2 text-primary-white/60 hover:text-green-500 hover:bg-green-500/10" 
              title="Duplicar"
            >
              <Copy size={16} />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              onClick={() => onDelete(product)}
              className="p-2 text-primary-white/60 hover:text-red-500 hover:bg-red-500/10" 
              title="Excluir"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}
