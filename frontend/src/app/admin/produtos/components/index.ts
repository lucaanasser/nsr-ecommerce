/**
 * Índice de componentes reutilizáveis
 * Facilita importações e mantém organização
 */

// Componentes de UI
export { default as SearchBar } from './SearchBar';
export { default as FilterButtonGroup } from './FilterButtonGroup';
export { default as LoadingState } from './LoadingState';
export { default as ErrorState } from './ErrorState';
export { default as EmptyState } from './EmptyState';
export { default as ProductTable } from './ProductTable';

// Modais
export { default as Modal } from './Modal';
export { default as ProductQuickView } from './ProductQuickView';
export { default as ConfirmModal } from './ConfirmModal';

// Ações em Lote
export { default as BulkActionsBar } from './BulkActionsBar';

// Formulário
export { default as StepIndicator } from './StepIndicator';
export { default as ProductFormWizard } from './ProductFormWizard';

// Steps do formulário
export { default as BasicInfoStep } from './form-steps/BasicInfoStep';
export { default as DescriptionStep } from './form-steps/DescriptionStep';
export { default as ImagesStep } from './form-steps/ImagesStep';
export { default as ReviewStep } from './form-steps/ReviewStep';
