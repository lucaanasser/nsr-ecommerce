'use client';

import { FolderTree } from 'lucide-react';
import EmptyState from '../components/EmptyState';

/**
 * Página de Gestão de Categorias
 * TODO: Implementar CRUD de categorias
 */
export default function CategoriasPage() {
  return (
    <EmptyState
      title="Gestão de Categorias"
      description="Funcionalidade em desenvolvimento. Em breve você poderá criar e gerenciar categorias de produtos."
      icon={<FolderTree className="text-primary-white/30" size={48} />}
    />
  );
}
