import { Package } from 'lucide-react';

/**
 * Estado vazio reutilizável
 */
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ 
  title = "Nenhum resultado encontrado",
  description = "Tente ajustar os filtros ou criar um novo item",
  icon,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="w-20 h-20 bg-dark-bg/50 rounded-full flex items-center justify-center">
        {icon || <Package className="text-primary-white/30" size={40} />}
      </div>
      <div className="text-center space-y-2 max-w-sm">
        <p className="text-primary-white font-medium text-lg">{title}</p>
        <p className="text-primary-white/60 text-sm">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-primary-gold hover:bg-primary-gold/90 text-dark-bg font-medium rounded-sm transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
