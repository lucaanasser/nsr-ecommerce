/**
 * LoadingOverlay - Componente de overlay para feedback de loading
 * 
 * Exibe um backdrop com blur e mensagem de progresso durante processamento
 * Usado no checkout para bloquear interações durante operações críticas
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({ 
  isVisible, 
  message = 'Processando...' 
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ 
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-dark-card border-2 border-primary-bronze/30 rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm mx-4"
          >
            {/* Spinner animado */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary-bronze/20 rounded-full blur-xl" />
              <Loader2 
                className="text-primary-bronze animate-spin relative z-10" 
                size={48} 
                strokeWidth={2.5}
              />
            </div>

            {/* Mensagem de progresso */}
            <div className="text-center">
              <p className="text-lg font-semibold text-primary-white mb-1">
                {message}
              </p>
              <p className="text-sm text-primary-white/60">
                Por favor, aguarde...
              </p>
            </div>

            {/* Indicador de progresso decorativo */}
            <motion.div 
              className="w-full h-1 bg-dark-border rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary-bronze to-primary-bronze/50"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
