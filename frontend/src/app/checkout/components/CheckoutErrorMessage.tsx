'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, XCircle, WifiOff, CreditCard, X } from 'lucide-react';

export type ErrorType = 'validation' | 'network' | 'payment' | 'server';

interface CheckoutErrorMessageProps {
  message: string;
  type?: ErrorType;
  onClose?: () => void;
  autoHideDuration?: number; // em milissegundos, 0 = não esconder automaticamente
}

/**
 * Componente de mensagem de erro estilizada para checkout
 * Segue a estética do site com tema dark e detalhes em bronze
 */
export default function CheckoutErrorMessage({
  message,
  type = 'server',
  onClose,
  autoHideDuration = 0,
}: CheckoutErrorMessageProps) {
  
  // Auto-hide após o tempo especificado
  if (autoHideDuration > 0 && onClose) {
    setTimeout(() => {
      onClose();
    }, autoHideDuration);
  }

  // Configuração visual baseada no tipo de erro
  const getErrorConfig = () => {
    switch (type) {
      case 'validation':
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          title: 'Dados Incompletos',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-500',
          iconColor: 'text-yellow-500',
        };
      case 'network':
        return {
          icon: <WifiOff className="w-6 h-6" />,
          title: 'Erro de Conexão',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-500',
          iconColor: 'text-red-500',
        };
      case 'payment':
        return {
          icon: <CreditCard className="w-6 h-6" />,
          title: 'Erro no Pagamento',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-500',
          iconColor: 'text-red-500',
        };
      case 'server':
      default:
        return {
          icon: <XCircle className="w-6 h-6" />,
          title: 'Erro no Servidor',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-500',
          iconColor: 'text-red-500',
        };
    }
  };

  const config = getErrorConfig();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ 
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={`
          ${config.bgColor} 
          ${config.borderColor} 
          border rounded-lg p-4 md:p-5
          shadow-lg
          backdrop-blur-sm
        `}
        role="alert"
      >
        <div className="flex items-start gap-4">
          {/* Ícone */}
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            {config.icon}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold mb-1 ${config.textColor}`}>
              {config.title}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Botão de fechar */}
          {onClose && (
            <button
              onClick={onClose}
              className={`
                flex-shrink-0 
                ${config.textColor}
                hover:opacity-70 
                transition-opacity 
                p-1 
                rounded-md
                focus:outline-none 
                focus:ring-2 
                focus:ring-bronze-500/50
              `}
              aria-label="Fechar mensagem de erro"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Barra de progresso para auto-hide */}
        {autoHideDuration > 0 && (
          <motion.div
            className={`mt-3 h-1 ${config.bgColor} rounded-full overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className={`h-full bg-gradient-to-r from-${config.textColor.replace('text-', '')} to-bronze-500`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: autoHideDuration / 1000, ease: 'linear' }}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Hook auxiliar para gerenciar mensagens de erro
 */
export function useCheckoutError() {
  const [error, setError] = useState<{
    message: string;
    type: ErrorType;
  } | null>(null);

  const showError = (message: string, type: ErrorType = 'server') => {
    setError({ message, type });
  };

  const clearError = () => {
    setError(null);
  };

  return { error, showError, clearError };
}
