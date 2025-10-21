import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Modal de confirmação para exclusão de conta
 */
export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-dark-card border-2 border-red-500/50 rounded-sm max-w-md w-full p-8 relative"
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary-white/50 hover:text-primary-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-primary-white text-center mb-2">
            Excluir Conta Permanentemente
          </h3>
          <p className="text-primary-white/60 text-center text-sm">
            Esta ação é <span className="text-red-500 font-semibold">irreversível</span>
          </p>
        </div>

        {/* Conteúdo */}
        <div className="mb-8">
          <p className="text-primary-white/70 text-sm mb-4">
            Todos os seus dados serão removidos permanentemente:
          </p>
          <ul className="space-y-2 text-primary-white/60 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Histórico de pedidos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Endereços salvos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Favoritos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Avaliações de produtos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Todas as informações pessoais</span>
            </li>
          </ul>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 py-3 border border-dark-border text-primary-white hover:bg-dark-bg"
          >
            Cancelar
          </Button>
          <Button
            variant="ghost"
            onClick={onConfirm}
            className="flex-1 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Confirmar Exclusão
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
