'use client';

import { Bell, Search } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

/**
 * Header do Painel Administrativo
 * Barra superior com busca, notificações e perfil
 */
export default function AdminHeader() {
  const { user } = useAdmin();

  return (
    <header className="h-16 bg-dark-card/50 backdrop-blur-sm border-b border-dark-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Busca */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-white/40" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-dark-bg/50 border border-dark-border rounded-sm pl-10 pr-4 py-2 text-sm text-primary-white placeholder:text-primary-white/40 focus:outline-none focus:border-primary-gold transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button className="relative p-2 text-primary-white/60 hover:text-primary-gold transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Perfil */}
        <div className="flex items-center gap-3 pl-4 border-l border-dark-border">
          <div className="w-9 h-9 rounded-full bg-primary-gold/20 border border-primary-gold flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-gold">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-primary-white">{user?.name}</p>
            <p className="text-xs text-primary-white/50">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
