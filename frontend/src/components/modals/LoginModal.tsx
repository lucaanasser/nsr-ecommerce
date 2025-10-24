import { useState, FormEvent } from 'react';
import { useLogin } from '@/hooks/useLogin';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/**
 * Exemplo de componente Modal de Login
 * 
 * Demonstra como reutilizar o hook useLogin em diferentes contextos.
 * Este componente pode ser usado em qualquer lugar do site, como:
 * - Checkout (para login rápido antes de finalizar compra)
 * - Páginas protegidas (para login inline)
 * - Header (dropdown de login)
 */

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectAfterLogin?: string;
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  redirectAfterLogin 
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { handleLogin, isLoading, error, clearError } = useLogin({
    redirectPath: redirectAfterLogin,
    onSuccess: (user) => {
      console.log('Login bem-sucedido:', user);
      onClose(); // Fechar modal após sucesso
    },
    onError: (error) => {
      console.error('Erro no login:', error);
    }
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  const handleInputChange = () => {
    if (error) clearError();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-dark-card p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-bronze">Login Rápido</h2>
          <button 
            onClick={onClose}
            className="text-primary-white/50 hover:text-primary-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange();
            }}
            placeholder="Email"
            required
          />
          
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleInputChange();
            }}
            placeholder="Senha"
            required
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-sm text-sm">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
