/**
 * Modal para adicionar título ao novo endereço
 */

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { X } from 'lucide-react';

interface AddressTitleModalProps {
  isOpen: boolean;
  titulo: string;
  onChangeTitulo: (titulo: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function AddressTitleModal({
  isOpen,
  titulo,
  onChangeTitulo,
  onConfirmar,
  onCancelar,
}: AddressTitleModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancelar}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-dark-card border border-dark-border p-6 rounded-sm max-w-md w-full mx-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Nomear Endereço</h3>
            <button
              onClick={onCancelar}
              className="text-primary-white/50 hover:text-primary-white"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-sm text-primary-white/70 mb-4">
            Dê um nome para identificar este endereço facilmente (ex: Casa, Trabalho, etc.)
          </p>

          <Input
            type="text"
            placeholder="Ex: Casa, Trabalho, Casa da Praia..."
            value={titulo}
            onChange={(e) => onChangeTitulo(e.target.value)}
            className="mb-4"
            autoFocus
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onCancelar}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirmar}
              disabled={!titulo.trim()}
              className="flex-1"
            >
              Salvar
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
