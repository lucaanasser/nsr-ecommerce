import { useState } from 'react';
import { VariantConfig, INITIAL_VARIANT_CONFIG } from '../types/variant.types';

/**
 * Interface do formulário de produto
 */
export interface ProductFormData {
  // Informações básicas
  name: string;
  slug: string;
  sku: string;
  category?: string;
  collectionId?: string;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  
  // Preços
  price: number;
  comparePrice?: number;
  
  // Descrição e detalhes
  description: string;
  specifications?: string;
  
  // Imagens
  images: Array<{
    url: string;
    altText?: string;
    order: number;
    isPrimary: boolean;
  }>;
  
  // Variantes (configuração completa)
  variantConfig: VariantConfig;
  
  // Variantes (para compatibilidade com backend)
  variants: Array<{
    size: string;
    color?: string;
    stock: number;
    sku?: string;
    priceAdjustment?: number;
  }>;  // Dimensões
  dimensions?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  
  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  
  // Flags
  isFeatured: boolean;
  isActive: boolean;
}

/**
 * Dados iniciais do formulário
 */
const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  sku: '',
  gender: 'UNISEX',
  price: 0,
  description: '',
  images: [],
  variantConfig: INITIAL_VARIANT_CONFIG,
  variants: [],
  isFeatured: false,
  isActive: true,
  seo: {
    keywords: [],
  },
};

/**
 * Hook para gerenciar o formulário de produto
 */
export function useProductForm(initialData?: Partial<ProductFormData>) {
  const [formData, setFormData] = useState<ProductFormData>({
    ...initialFormData,
    ...initialData,
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Atualizar campo específico
  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando for editado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Atualizar múltiplos campos
  const updateFields = (updates: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Gerar slug automaticamente a partir do nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  };

  // Auto-gerar slug quando nome mudar
  const updateName = (name: string) => {
    updateField('name', name);
    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
      updateField('slug', generateSlug(name));
    }
  };

  // Validar step atual
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Informações básicas
        if (!formData.name.trim()) {
          newErrors.name = 'Nome é obrigatório';
        }
        if (!formData.slug.trim()) {
          newErrors.slug = 'Slug é obrigatório';
        }
        if (formData.price <= 0) {
          newErrors.price = 'Preço deve ser maior que zero';
        }
        break;
      
      case 1: // Descrição
        if (!formData.description.trim()) {
          newErrors.description = 'Descrição é obrigatória';
        }
        break;
      
      case 2: // Imagens
        if (formData.images.length === 0) {
          newErrors.images = 'Adicione pelo menos uma imagem';
        }
        break;
      
      case 3: // Variantes
        // Verificar se há tamanhos selecionados (exceto se for único)
        if (formData.variantConfig.sizeType !== 'unique' && formData.variantConfig.sizes.length === 0) {
          newErrors.variants = 'Selecione pelo menos um tamanho';
        }
        
        // Verificar se há cores selecionadas (quando cores estão ativadas)
        if (formData.variantConfig.hasColors && formData.variantConfig.colors.length === 0) {
          newErrors.variants = 'Selecione pelo menos uma cor ou desative as cores';
        }
        
        // Verificar se há variantes geradas
        if (formData.variantConfig.variants.length === 0) {
          newErrors.variants = 'Configure pelo menos uma variante';
        }
        
        // Verificar se há estoque negativo
        const hasNegativeStock = formData.variantConfig.variants.some(v => v.stock < 0);
        if (hasNegativeStock) {
          newErrors.variants = 'Estoque não pode ser negativo';
        }
        
        // Verificar se todas as variantes estão zeradas
        const allZeroStock = formData.variantConfig.variants.every(v => v.stock === 0);
        if (allZeroStock && formData.variantConfig.variants.length > 0) {
          newErrors.variants = 'Pelo menos uma variante deve ter estoque maior que zero';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar entre steps
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Submeter formulário
  const submitForm = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Integrar com API
      console.log('Dados do produto:', formData);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return { success: true, data: formData };
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSaving(false);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setErrors({});
  };

  return {
    formData,
    currentStep,
    errors,
    isSaving,
    updateField,
    updateFields,
    updateName,
    generateSlug,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    submitForm,
    resetForm,
  };
}
