'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useProducts } from './hooks/useProducts';
import { useSelection } from './hooks/useSelection';
import SearchBar from './components/SearchBar';
import FilterButtonGroup from './components/FilterButtonGroup';
import ProductTable from './components/ProductTable';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import ProductQuickView from './components/ProductQuickView';
import ConfirmModal from './components/ConfirmModal';
import BulkActionsBar from './components/BulkActionsBar';
import { Product } from '@/services/product.service';

/**
 * Página de Listagem de Produtos - Versão Completa
 * Suporta seleção múltipla, ações em lote, visualização rápida
 */
export default function AdminProdutosPage() {
  const router = useRouter();
  const { 
    products, 
    isLoading, 
    error, 
    filters, 
    updateFilters,
    refetch 
  } = useProducts();

  // Seleção múltipla
  const selection = useSelection(products);

  // Estados de modais
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    product?: Product;
    multiple?: boolean;
  }>({ show: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // Opções de filtro de gênero
  const genderOptions = [
    { value: 'todos' as const, label: 'Todos' },
    { value: 'MALE' as const, label: 'Masculino' },
    { value: 'FEMALE' as const, label: 'Feminino' },
    { value: 'UNISEX' as const, label: 'Unissex' },
  ];

  // Handlers individuais
  const handleView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/produtos/${product.id}`);
  };

  const handleDelete = (product: Product) => {
    setDeleteConfirm({ show: true, product });
  };

  const handleDuplicate = (product: Product) => {
    console.log('Duplicar produto:', product);
    alert(`Produto "${product.name}" duplicado com sucesso!`);
    refetch();
  };

  const handleNewProduct = () => {
    router.push('/admin/produtos/novo');
  };

  // Handlers de ações em lote
  const handleBulkActivate = () => {
    console.log('Ativar produtos:', selection.selectedItems);
    alert(`${selection.selectedCount} produtos ativados!`);
    selection.deselectAll();
    refetch();
  };

  const handleBulkDeactivate = () => {
    console.log('Desativar produtos:', selection.selectedItems);
    alert(`${selection.selectedCount} produtos desativados!`);
    selection.deselectAll();
    refetch();
  };

  const handleBulkDuplicate = () => {
    console.log('Duplicar produtos:', selection.selectedItems);
    alert(`${selection.selectedCount} produtos duplicados!`);
    selection.deselectAll();
    refetch();
  };

  const handleBulkDelete = () => {
    setDeleteConfirm({ show: true, multiple: true });
  };

  // Confirmar exclusão
  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (deleteConfirm.multiple) {
        console.log('Excluir múltiplos:', selection.selectedItems);
        alert(`${selection.selectedCount} produtos excluídos!`);
        selection.deselectAll();
      } else if (deleteConfirm.product) {
        console.log('Excluir produto:', deleteConfirm.product);
        alert(`Produto "${deleteConfirm.product.name}" excluído!`);
      }

      refetch();
      setDeleteConfirm({ show: false });
    } catch (error) {
      alert('Erro ao excluir');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Header com botão de ação */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-primary-white/50">
          {!isLoading && (
            <>
              {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              {selection.selectedCount > 0 && (
                <span className="ml-2 text-primary-gold font-medium">
                  ({selection.selectedCount} selecionado{selection.selectedCount !== 1 ? 's' : ''})
                </span>
              )}
            </>
          )}
        </div>
        <Button 
          variant="primary" 
          onClick={handleNewProduct}
          className="flex items-center gap-2 px-4 py-2"
        >
          <Plus size={20} />
          Novo Produto
        </Button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <SearchBar
            value={filters.search || ''}
            onChange={(value) => updateFilters({ search: value })}
            placeholder="Buscar produtos..."
            className="flex-1"
          />

          {/* Filtro de Gênero */}
          <FilterButtonGroup
            options={genderOptions}
            selected={filters.gender || 'todos'}
            onChange={(value) => updateFilters({ gender: value })}
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      {isLoading ? (
        <LoadingState message="Carregando produtos..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : products.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description={
            filters.search || filters.gender !== 'todos'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando seu primeiro produto'
          }
          action={
            !filters.search && filters.gender === 'todos'
              ? {
                  label: 'Criar Primeiro Produto',
                  onClick: handleNewProduct,
                }
              : undefined
          }
        />
      ) : (
        <ProductTable
          products={products}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          selectable
          selectedIds={selection.selectedIds}
          onToggleSelection={selection.toggleSelection}
          onSelectAll={selection.allSelected ? selection.deselectAll : selection.selectAll}
          allSelected={selection.allSelected}
          someSelected={selection.someSelected}
        />
      )}

      {/* Barra de Ações em Lote */}
      <BulkActionsBar
        selectedCount={selection.selectedCount}
        totalCount={selection.totalCount}
        onSelectAll={selection.selectAll}
        onDeselectAll={selection.deselectAll}
        onActivate={handleBulkActivate}
        onDeactivate={handleBulkDeactivate}
        onDuplicate={handleBulkDuplicate}
        onDelete={handleBulkDelete}
      />

      {/* Modal de Visualização Rápida */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onEdit={handleEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false })}
        onConfirm={confirmDelete}
        title={deleteConfirm.multiple ? 'Excluir Produtos' : 'Excluir Produto'}
        message={
          deleteConfirm.multiple
            ? `Tem certeza que deseja excluir ${selection.selectedCount} produto${selection.selectedCount !== 1 ? 's' : ''}? Esta ação não pode ser desfeita.`
            : `Tem certeza que deseja excluir "${deleteConfirm.product?.name}"? Esta ação não pode ser desfeita.`
        }
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
