import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

/**
 * Modal de confirmação reutilizável
 * Usado para ações destrutivas ou importantes
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const colors = {
    danger: {
      icon: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      button: 'bg-yellow-500 hover:bg-yellow-600',
    },
    info: {
      icon: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      button: 'bg-blue-500 hover:bg-blue-600',
    },
  };

  const theme = colors[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="p-6 text-center">
        {/* Ícone */}
        <div className={`w-16 h-16 mx-auto mb-4 ${theme.bg} ${theme.border} border rounded-full flex items-center justify-center`}>
          <AlertTriangle className={theme.icon} size={32} />
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-primary-white mb-2">
          {title}
        </h3>

        {/* Mensagem */}
        <p className="text-sm text-primary-white/70 mb-6">
          {message}
        </p>

        {/* Botões */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border border-dark-border"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${theme.button} text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
