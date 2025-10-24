import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { getErrorMessage } from '@/services';

interface LoginFormData {
  email: string;
  password: string;
}

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const router = useRouter();

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro quando o usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Após login bem-sucedido, buscar o usuário do localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Redirecionar baseado no role do usuário
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/perfil');
        }
      } else {
        // Fallback caso não encontre o usuário
        router.push('/perfil');
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setIsLoading(false);
    }
  };

  // Preenche credenciais de exemplo para testes
  const fillCredentials = (type: 'user' | 'admin') => {
    if (type === 'user') {
      setFormData({ email: 'customer@nsr.com', password: 'password123' });
    } else {
      setFormData({ email: 'admin@nsr.com', password: 'admin123' });
    }
    setError('');
  };

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit,
    fillCredentials,
  };
}
