'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  BarChart3, 
  FolderTree, 
  Palette, 
  TrendingUp 
} from 'lucide-react';

/**
 * Layout com sub-navegação para gestão de produtos
 * Padrão similar ao perfil do usuário
 */
export default function ProdutosLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();

  const tabs = [
    { 
      id: 'lista', 
      label: 'Todos os Produtos', 
      href: '/admin/produtos', 
      icon: Package,
      exactMatch: true
    },
    { 
      id: 'novo', 
      label: 'Adicionar', 
      href: '/admin/produtos/novo', 
      icon: Plus 
    },
    { 
      id: 'estoque', 
      label: 'Estoque', 
      href: '/admin/produtos/estoque', 
      icon: BarChart3 
    },
    { 
      id: 'categorias', 
      label: 'Categorias', 
      href: '/admin/produtos/categorias', 
      icon: FolderTree 
    },
    { 
      id: 'colecoes', 
      label: 'Coleções', 
      href: '/admin/produtos/colecoes', 
      icon: Palette 
    },
    { 
      id: 'relatorios', 
      label: 'Relatórios', 
      href: '/admin/produtos/relatorios', 
      icon: TrendingUp 
    },
  ];

  // Função para verificar se a tab está ativa
  const isActiveTab = (href: string, exactMatch?: boolean) => {
    if (exactMatch) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-6">
      {/* Header da seção */}
      <div>
        <h1 className="text-3xl font-bold text-primary-white mb-2">
          Gestão de Produtos
        </h1>
        <p className="text-primary-white/60">
          Gerencie produtos, categorias, coleções e estoque
        </p>
      </div>

      {/* Sub-navegação por abas */}
      <div className="flex gap-2 border-b border-dark-border overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isActiveTab(tab.href, tab.exactMatch);
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors
                ${isActive 
                  ? 'text-primary-gold border-primary-gold' 
                  : 'text-primary-white/60 border-transparent hover:text-primary-white hover:border-primary-white/30'
                }
              `}
            >
              <Icon size={18} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Conteúdo da sub-página */}
      <div>{children}</div>
    </div>
  );
}
