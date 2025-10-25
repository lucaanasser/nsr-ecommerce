'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductFormWizard from '../components/ProductFormWizard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { products } from '@/data/products';
import { ProductFormData } from '../hooks/useProductForm';

/**
 * Página de Edição de Produto
 * Reutiliza o ProductFormWizard com dados pré-carregados
 */
export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<ProductFormData> | null>(null);

  // Carregar dados do produto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);

        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Buscar produto (mockado)
        const product = products.find((p) => p.id === productId);

        if (!product) {
          setError('Produto não encontrado');
          return;
        }

        // Mapear dados do produto para o formato do formulário
        const formData: Partial<ProductFormData> = {
          name: product.name,
          slug: product.slug,
          price: product.price,
          description: product.description,
          images: product.images.map((url, index) => ({
            url,
            altText: product.name,
            order: index,
            isPrimary: index === 0,
          })),
          isFeatured: product.featured,
          isActive: true,
          gender: product.category === 'masculino' ? 'MALE' : 'FEMALE',
        };

        setInitialData(formData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar produto');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleSuccess = (data: any) => {
    console.log('Produto atualizado:', data);
    alert('Produto atualizado com sucesso!');
    router.push('/admin/produtos');
  };

  const handleCancel = () => {
    if (confirm('Deseja realmente cancelar? Todas as alterações não salvas serão perdidas.')) {
      router.push('/admin/produtos');
    }
  };

  if (isLoading) {
    return <LoadingState message="Carregando produto..." />;
  }

  if (error || !initialData) {
    return (
      <ErrorState
        message={error || 'Produto não encontrado'}
        onRetry={() => router.push('/admin/produtos')}
      />
    );
  }

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
            Editar Produto
          </h2>
          <p className="text-sm text-primary-white/60 mt-1">
            {initialData.name}
          </p>
        </div>
      </div>

      {/* Wizard de Edição - Reutiliza o mesmo componente */}
      <ProductFormWizard
        initialData={initialData}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isEditMode
      />
    </div>
  );
}
