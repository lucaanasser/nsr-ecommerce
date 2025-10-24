'use client';

import { Palette } from 'lucide-react';
import EmptyState from '../components/EmptyState';

/**
 * Página de Gestão de Coleções
 * TODO: Implementar CRUD de coleções
 */
export default function ColecoesPage() {
  return (
    <EmptyState
      title="Gestão de Coleções"
      description="Funcionalidade em desenvolvimento. Em breve você poderá criar e gerenciar coleções sazonais e temáticas."
      icon={<Palette className="text-primary-white/30" size={48} />}
    />
  );
}
