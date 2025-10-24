/**
 * CheckoutLoginForm
 * Formulário de login adaptado para o contexto do checkout
 * Mantém a estética do checkout e não redireciona para outras páginas
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authService, getErrorMessage } from '@/services';
import type { AuthUser } from '@/services';

interface CheckoutLoginFormProps {
  onLoginSuccess: (user: AuthUser) => void;
  onSwitchToCadastro: () => void;
}

export default function CheckoutLoginForm({ onLoginSuccess, onSwitchToCadastro }: CheckoutLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Se já existe um usuário logado, fazer logout primeiro
      if (authService.isAuthenticated()) {
        console.log('[CheckoutLoginForm] Usuário já logado, fazendo logout primeiro');
        await authService.logout();
      }

      const response = await authService.login({ email, password });
      
      if (response.user) {
        console.log('[CheckoutLoginForm] Login bem-sucedido:', response.user);
        // Login bem-sucedido - chama callback sem redirecionar
        onLoginSuccess(response.user);
      }
    } catch (err: any) {
      console.error('[CheckoutLoginForm] Erro ao fazer login:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 p-3 rounded-sm text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-dark-bg/50"
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-dark-bg/50"
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
