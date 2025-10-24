/**
 * NotLoggedView
 * View para usuários não autenticados
 * Permite escolher entre fazer login ou criar nova conta
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CheckoutLoginForm from '../../forms/CheckoutLoginForm';
import CheckoutRegisterForm from '../../forms/CheckoutRegisterForm';
import type { AuthUser } from '@/services';

interface NotLoggedViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  onRegisterSuccess: (user: AuthUser) => void;
}

type ViewMode = 'login' | 'register';

export default function NotLoggedView({ onLoginSuccess, onRegisterSuccess }: NotLoggedViewProps) {
  const [mode, setMode] = useState<ViewMode>('login');

  return (
    <div className="space-y-6">
      {/* Aviso sobre necessidade de conta */}
      <div className="bg-primary-bronze/10 border border-primary-bronze/30 p-4 rounded-sm">
        <p className="text-sm text-primary-white/80">
          Para finalizar sua compra e acompanhar seu pedido, você precisa de uma conta.
        </p>
      </div>

      {/* Tabs para alternar entre Login e Cadastro */}
      <div className="flex gap-2 border-b border-dark-border">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`px-6 py-3 text-sm font-semibold transition-all relative ${
            mode === 'login'
              ? 'text-primary-bronze'
              : 'text-primary-white/50 hover:text-primary-white/80'
          }`}
        >
          Já tenho conta
          {mode === 'login' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-bronze"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
        
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`px-6 py-3 text-sm font-semibold transition-all relative ${
            mode === 'register'
              ? 'text-primary-bronze'
              : 'text-primary-white/50 hover:text-primary-white/80'
          }`}
        >
          Criar nova conta
          {mode === 'register' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-bronze"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Conteúdo da tab ativa */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
        transition={{ duration: 0.3 }}
      >
        {mode === 'login' ? (
          <CheckoutLoginForm 
            onLoginSuccess={onLoginSuccess}
            onSwitchToCadastro={() => setMode('register')}
          />
        ) : (
          <CheckoutRegisterForm 
            onRegisterSuccess={onRegisterSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </motion.div>
    </div>
  );
}
