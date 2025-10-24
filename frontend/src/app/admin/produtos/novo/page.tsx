'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductFormWizard from '../components/ProductFormWizard';

/**
 * Página de Criação de Produto
 */
export default function NovoProdutoPage() {
  const router = useRouter();

  const handleSuccess = (data: any) => {
    console.log('Produto criado com sucesso:', data);
    
    // Mostrar mensagem de sucesso
    alert('Produto criado com sucesso!');
    
    // Redirecionar para listagem
    router.push('/admin/produtos');
  };

  const handleCancel = () => {
    if (confirm('Deseja realmente cancelar? Todas as alterações serão perdidas.')) {
      router.push('/admin/produtos');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-primary-white">
            Novo Produto
          </h2>
          <p className="text-sm text-primary-white/60 mt-1">
            Preencha as informações para criar um novo produto
          </p>
        </div>
      </div>

      {/* Wizard de Criação */}
      <ProductFormWizard
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
