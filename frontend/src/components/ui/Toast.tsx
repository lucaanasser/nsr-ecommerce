'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose,
  duration = 3000 
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-24 left-1/2 z-[60] max-w-md"
        >
          <div className={`flex items-center gap-3 px-6 py-4 rounded-sm shadow-2xl backdrop-blur-sm ${
            type === 'success' 
              ? 'bg-green-600/90 border border-green-500' 
              : 'bg-red-600/90 border border-red-500'
          }`}>
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <Check size={20} className="text-white" />
              ) : (
                <X size={20} className="text-white" />
              )}
            </div>
            <p className="text-white font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-auto text-white/70 hover:text-white transition-colors"
              aria-label="Fechar notificação"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
