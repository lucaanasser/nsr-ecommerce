'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Interface do Usuário
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  title?: string; // "Sócio Fundador", "Sócio", etc
  color?: string; // Cor para identificação visual
}

/**
 * Interface do Contexto de Administração
 */
interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

/**
 * Credenciais Mockadas
 */
const MOCK_CREDENTIALS = {
  user: {
    email: 'usuario@nsr.com',
    password: '123456',
    data: {
      id: '1',
      name: 'Usuário NSR',
      email: 'usuario@nsr.com',
      role: 'user' as const,
    },
  },
  admin1: {
    email: 'admin@nsr.com',
    password: 'admin123',
    data: {
      id: '2',
      name: 'Luca',
      email: 'admin@nsr.com',
      role: 'admin' as const,
      avatar: 'L',
      title: 'Sócio Fundador',
      color: '#D4AF37', // Gold
    },
  },
  admin2: {
    email: 'socio@nsr.com',
    password: 'socio123',
    data: {
      id: '3',
      name: 'Sócio NSR',
      email: 'socio@nsr.com',
      role: 'admin' as const,
      avatar: 'S',
      title: 'Sócio',
      color: '#CD7F32', // Bronze
    },
  },
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/**
 * Provider do Contexto de Administração
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Recupera usuário do localStorage ao montar
  useEffect(() => {
    const storedUser = localStorage.getItem('nsr_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('nsr_user');
      }
    }
  }, []);

  /**
   * Função de Login Mockada
   * Verifica credenciais e retorna true/false
   */
  const login = (email: string, password: string): boolean => {
    // Verifica se é usuário comum
    if (
      email === MOCK_CREDENTIALS.user.email &&
      password === MOCK_CREDENTIALS.user.password
    ) {
      const userData = MOCK_CREDENTIALS.user.data;
      setUser(userData);
      localStorage.setItem('nsr_user', JSON.stringify(userData));
      
      // Redireciona para perfil
      setTimeout(() => router.push('/perfil'), 100);
      return true;
    }

    // Verifica se é admin1 (Sócio Fundador)
    if (
      email === MOCK_CREDENTIALS.admin1.email &&
      password === MOCK_CREDENTIALS.admin1.password
    ) {
      const userData = MOCK_CREDENTIALS.admin1.data;
      setUser(userData);
      localStorage.setItem('nsr_user', JSON.stringify(userData));
      
      // Redireciona para admin
      setTimeout(() => router.push('/admin'), 100);
      return true;
    }

    // Verifica se é admin2 (Sócio)
    if (
      email === MOCK_CREDENTIALS.admin2.email &&
      password === MOCK_CREDENTIALS.admin2.password
    ) {
      const userData = MOCK_CREDENTIALS.admin2.data;
      setUser(userData);
      localStorage.setItem('nsr_user', JSON.stringify(userData));
      
      // Redireciona para admin
      setTimeout(() => router.push('/admin'), 100);
      return true;
    }

    // Credenciais inválidas
    return false;
  };

  /**
   * Função de Logout
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('nsr_user');
    router.push('/');
  };

  const value: AdminContextType = {
    user,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

/**
 * Hook para usar o contexto de admin
 */
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin deve ser usado dentro de um AdminProvider');
  }
  return context;
}
