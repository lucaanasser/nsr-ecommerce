import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface SaveChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Modal de confirmação para salvar alterações no perfil
 */
export default function SaveChangesModal({ isOpen, onClose, onConfirm }: SaveChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-dark-card border-2 border-primary-bronze rounded-sm max-w-md w-full p-8 relative"
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-bronze/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-primary-bronze text-center mb-2 font-nsr">
            Confirmar Alterações
          </h3>
          <p className="text-primary-white/60 text-center text-sm">
            Tem certeza que deseja salvar as alterações?
          </p>
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
            variant="primary"
            onClick={onConfirm}
            className="flex-1 py-3"
          >
            Confirmar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
