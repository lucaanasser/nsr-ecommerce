import { Check, Copy, Trash2, Power, PowerOff } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

/**
 * Barra de ações em lote
 * Aparece quando há itens selecionados
 */
export default function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onActivate,
  onDeactivate,
  onDuplicate,
  onDelete,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  const allSelected = selectedCount === totalCount;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-dark-card border-2 border-primary-gold rounded-sm shadow-2xl px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Contador */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-gold text-dark-bg rounded-full flex items-center justify-center font-bold text-sm">
              {selectedCount}
            </div>
            <div className="text-sm">
              <p className="text-primary-white font-medium">
                {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
              <button
                onClick={allSelected ? onDeselectAll : onSelectAll}
                className="text-primary-gold text-xs hover:underline"
              >
                {allSelected ? 'Desmarcar todos' : `Selecionar todos (${totalCount})`}
              </button>
            </div>
          </div>

          {/* Divisor */}
          <div className="w-px h-10 bg-dark-border" />

          {/* Ações */}
          <div className="flex items-center gap-2">
            {onActivate && (
              <Button
                variant="ghost"
                onClick={onActivate}
                className="flex items-center gap-2 px-4 py-2 text-green-500 hover:bg-green-500/10"
                title="Ativar selecionados"
              >
                <Power size={16} />
                Ativar
              </Button>
            )}

            {onDeactivate && (
              <Button
                variant="ghost"
                onClick={onDeactivate}
                className="flex items-center gap-2 px-4 py-2 text-yellow-500 hover:bg-yellow-500/10"
                title="Desativar selecionados"
              >
                <PowerOff size={16} />
                Desativar
              </Button>
            )}

            {onDuplicate && (
              <Button
                variant="ghost"
                onClick={onDuplicate}
                className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-500/10"
                title="Duplicar selecionados"
              >
                <Copy size={16} />
                Duplicar
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10"
                title="Excluir selecionados"
              >
                <Trash2 size={16} />
                Excluir
              </Button>
            )}
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onDeselectAll}
            className="ml-2 text-primary-white/60 hover:text-primary-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
