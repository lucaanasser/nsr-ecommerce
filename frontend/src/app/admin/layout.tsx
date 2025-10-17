'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';

/**
 * Layout do Painel Administrativo
 * Protege rotas e fornece estrutura com sidebar e header
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isAuthenticated } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    // Redireciona se não estiver autenticado ou não for admin
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Mostra loading enquanto verifica autenticação
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-gold border-t-transparent mb-4"></div>
          <p className="text-primary-white/60">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-[260px] transition-all duration-300">
        <AdminHeader />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
