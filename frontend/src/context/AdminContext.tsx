'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuthContext } from './AuthContext';

/**
 * Interface do Usuário (mantida para compatibilidade)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  title?: string;
  color?: string;
}

/**
 * Interface do Contexto de Administração
 * Agora é um wrapper do AuthContext para manter compatibilidade
 */
interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/**
 * Provider do Contexto de Administração
 * Agora usa o AuthContext real, mantendo interface compatível
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isAuthenticated, login: authLogin, logout: authLogout } = useAuthContext();

  // Converter usuário do AuthContext para formato do AdminContext
  const user: User | null = authUser ? {
    id: authUser.id,
    name: `${authUser.firstName} ${authUser.lastName}`,
    email: authUser.email,
    role: authUser.role === 'ADMIN' ? 'admin' : 'user',
    avatar: authUser.firstName.charAt(0).toUpperCase(),
    title: authUser.role === 'ADMIN' ? 'Administrador' : 'Cliente',
    color: authUser.role === 'ADMIN' ? '#D4AF37' : '#CD7F32',
  } : null;

  /**
   * Função de Login (wrapper para AuthContext)
   */
  const login = (email: string, password: string): boolean => {
    // Chama login assíncrono mas retorna true imediatamente
    // O redirecionamento será feito pela página de login
    authLogin(email, password).catch(console.error);
    return true;
  };

  /**
   * Função de Logout (wrapper para AuthContext)
   */
  const logout = () => {
    authLogout();
  };

  const value: AdminContextType = {
    user,
    isAdmin: user?.role === 'admin',
    isAuthenticated,
    login,
    logout,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

/**
 * Hook para usar o contexto de administração
 */
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
