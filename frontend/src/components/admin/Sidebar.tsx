'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Warehouse,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  CheckSquare,
  Calendar,
  Table
} from 'lucide-react';
import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Sidebar do Painel Administrativo
 * Navegação lateral com menu colapsável
 */
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAdmin();

  const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/produtos', icon: Package, label: 'Produtos' },
    { href: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
    { href: '/admin/estoque', icon: Warehouse, label: 'Estoque' },
    { href: '/admin/usuarios', icon: Users, label: 'Usuários' },
    { href: '/admin/financeiro', icon: DollarSign, label: 'Financeiro' },
    { href: '/admin/documentos', icon: FileText, label: 'Documentos' },
    { href: '/admin/tarefas', icon: CheckSquare, label: 'Tarefas' },
    { href: '/admin/calendario', icon: Calendar, label: 'Calendário' },
    { href: '/admin/planilhas', icon: Table, label: 'Planilhas' },
    { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-dark-card border-r border-dark-border flex flex-col fixed left-0 top-0 z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-dark-border px-4">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xl font-arabic text-primary-gold">ناصر</span>
              <span className="text-xs text-primary-white/50">ADMIN</span>
            </motion.div>
          ) : (
            <motion.span
              key="collapsed-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-arabic text-primary-gold"
            >
              ن
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 mb-1 rounded-sm transition-all
                ${active 
                  ? 'bg-primary-gold/10 text-primary-gold border-l-2 border-primary-gold' 
                  : 'text-primary-white/60 hover:bg-dark-bg hover:text-primary-white'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={20} className="flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-dark-border p-2">
        <button
          onClick={logout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-sm
            text-red-400 hover:bg-red-500/10 transition-all
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Sair
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-dark-card border border-dark-border rounded-full flex items-center justify-center text-primary-white/60 hover:text-primary-gold hover:border-primary-gold transition-all"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
}
