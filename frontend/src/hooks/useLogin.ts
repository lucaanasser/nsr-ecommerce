import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { getErrorMessage } from '@/services';

/**
 * Hook reutilizável para funcionalidade de login
 * 
 * Pode ser usado em qualquer componente ou página que precise implementar login.
 * Exemplo: modal de login, página de login, checkout, etc.
 * 
 * @param redirectPath - (opcional) Caminho para redirecionar após login bem-sucedido
 * @param onSuccess - (opcional) Callback executado após login bem-sucedido
 * @param onError - (opcional) Callback executado em caso de erro
 */
interface UseLoginOptions {
  redirectPath?: string;
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export function useLogin(options: UseLoginOptions = {}) {
  const { redirectPath, onSuccess, onError } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthContext();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Após login bem-sucedido, buscar o usuário do localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        
        // Executar callback se fornecido
        if (onSuccess) {
          onSuccess(user);
        }
        
        // Redirecionar baseado no redirectPath ou role do usuário
        if (redirectPath) {
          router.push(redirectPath);
        } else if (user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/perfil');
        }
      } else {
        // Fallback
        router.push(redirectPath || '/perfil');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      // Executar callback de erro se fornecido
      if (onError) {
        onError(errorMessage);
      }
      
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return {
    handleLogin,
    isLoading,
    error,
    clearError,
  };
}
