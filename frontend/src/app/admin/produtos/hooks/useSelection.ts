import { useState, useMemo } from 'react';

/**
 * Hook para gerenciar seleção múltipla de itens
 * Reutilizável para qualquer lista de itens
 */
export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Verificar se um item está selecionado
  const isSelected = (id: string) => selectedIds.has(id);

  // Alternar seleção de um item
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Selecionar todos os itens
  const selectAll = () => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  };

  // Desselecionar todos
  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  // Obter itens selecionados
  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  // Contadores
  const selectedCount = selectedIds.size;
  const totalCount = items.length;
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  return {
    selectedIds,
    selectedItems,
    selectedCount,
    totalCount,
    allSelected,
    someSelected,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
  };
}
