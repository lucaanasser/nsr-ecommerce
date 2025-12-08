import { useState } from 'react';
import { VariantConfig, INITIAL_VARIANT_CONFIG } from '../types/variant.types';
import { productService } from '@/services/productService';
import { CreateProductDTO } from '@/types/product';
import { 
  transformFormDataToAPI, 
  extractFilesToUpload 
} from '@/utils/productTransform';
import { logger, measureTime } from '@/utils/logger';

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
    const stepNames = ['Básico', 'Descrição', 'Imagens', 'Variantes', 'Revisão'];

    logger.debug(`Validando step ${currentStep}: ${stepNames[currentStep]}`);

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

    const isValid = Object.keys(newErrors).length === 0;
    logger.productCreation.validation(stepNames[currentStep], isValid, newErrors);

    setErrors(newErrors);
    return isValid;
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

  // Transformar dados do formulário para formato da API
  const transformToAPI = (): CreateProductDTO => {
    return transformFormDataToAPI(formData);
  };

  // Upload de imagens para produto existente
  const uploadImagesToProduct = async (productId: string, files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    logger.upload.start(files);

    try {
      const url = `/api/v1/admin/products/${productId}/images`;
      logger.api.request('POST', url);

      // Fazer upload via productService (retorna array de URLs)
      const uploadedUrls = await measureTime(
        'Upload de imagens',
        () => productService.uploadImages(productId, files)
      );

      logger.upload.success(uploadedUrls);
      
      return uploadedUrls;
    } catch (error) {
      logger.upload.error('Upload para produto', error);
      throw error;
    }
  };

  // Submeter formulário
  const submitForm = async () => {
    logger.productCreation.start(formData.name);

    // Validar todas as etapas
    logger.info('Validando todos os campos...');
    if (!validateAllSteps()) {
      logger.productCreation.error('Validação', { errors });
      return { success: false, error: 'Há erros no formulário. Verifique todos os campos.' };
    }

    setIsSaving(true);
    
    try {
      // 1. Verificar se há imagens para upload
      const filesToUpload = extractFilesToUpload(formData.images as any);
      const hasFilesToUpload = filesToUpload.length > 0;
      
      if (hasFilesToUpload) {
        logger.info(`${filesToUpload.length} imagem(ns) será(ão) enviada(s) após criar o produto`);
      }

      // 2. Transformar dados para API (SEM imagens se houver arquivos locais)
      logger.info('Transformando dados para API...');
      const payload = await measureTime(
        'Transformação de dados',
        () => transformToAPI()
      );
      
      // Remover imagens se houver arquivos para upload (enviaremos depois)
      if (hasFilesToUpload) {
        payload.images = [];
        logger.warning('Imagens removidas do payload inicial (serão enviadas após criação)');
      }
      
      logger.productCreation.transform({
        name: payload.name,
        slug: payload.slug,
        price: payload.price,
        stock: payload.stock,
        imagens: payload.images?.length || 0,
        variantes: payload.variants?.length || 0,
      });

      // 3. Criar produto
      logger.productCreation.apiCall('POST', '/api/v1/admin/products', {
        ...payload,
        images: `${payload.images?.length || 0} imagens no payload`,
        variants: `${payload.variants?.length || 0} variantes`,
      });

      const product = await measureTime(
        'Criação do produto',
        () => productService.createProduct(payload)
      );
      
      logger.success(`✓ Produto criado com ID: ${product.id}`);

      // 4. Upload de imagens (se houver arquivos locais)
      if (hasFilesToUpload) {
        logger.productCreation.imageUpload(filesToUpload.length);
        
        try {
          const uploadedUrls = await measureTime(
            'Upload de imagens para produto',
            () => uploadImagesToProduct(product.id, filesToUpload)
          );
          
          logger.productCreation.imageUpload(uploadedUrls.length, uploadedUrls);
          logger.success(`✓ ${uploadedUrls.length} imagem(ns) enviada(s) com sucesso`);
        } catch (uploadError: any) {
          logger.error('Erro ao fazer upload de imagens (produto já criado)', uploadError);
          logger.warning('ATENÇÃO: Produto foi criado mas as imagens falharam. Você pode adicioná-las depois editando o produto.');
          
          // Produto foi criado, mas upload falhou - ainda é um sucesso parcial
          return { 
            success: true, 
            data: product,
            warning: 'Produto criado, mas falha no upload de imagens. Adicione-as editando o produto.'
          };
        }
      }
      
      logger.productCreation.success(product.id, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        images: hasFilesToUpload ? filesToUpload.length : 0,
      });
      
      return { success: true, data: product };
    } catch (error: any) {
      logger.productCreation.error('Criação do produto', error);
      
      let errorMessage = 'Erro ao salvar produto';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        logger.error('Mensagem do servidor:', error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  // Validar todos os steps
  const validateAllSteps = (): boolean => {
    logger.group('🔍 Validação Completa');
    const allErrors: Record<string, string> = {};

    // Step 0: Básico
    logger.validation.field('name', formData.name, !!formData.name.trim());
    if (!formData.name.trim()) allErrors.name = 'Nome é obrigatório';
    
    logger.validation.field('slug', formData.slug, !!formData.slug.trim());
    if (!formData.slug.trim()) allErrors.slug = 'Slug é obrigatório';
    
    logger.validation.field('price', formData.price, formData.price > 0);
    if (formData.price <= 0) allErrors.price = 'Preço deve ser maior que zero';

    // Step 1: Descrição
    logger.validation.field('description', formData.description, !!formData.description.trim());
    if (!formData.description.trim()) allErrors.description = 'Descrição é obrigatória';

    // Step 2: Imagens
    logger.validation.field('images', `${formData.images.length} imagem(ns)`, formData.images.length > 0);
    if (formData.images.length === 0) allErrors.images = 'Adicione pelo menos uma imagem';

    // Step 3: Variantes
    logger.validation.field('variants', `${formData.variantConfig.variants.length} variante(s)`, formData.variantConfig.variants.length > 0);
    if (formData.variantConfig.variants.length === 0) {
      allErrors.variants = 'Configure pelo menos uma variante';
    }

    const hasNegativeStock = formData.variantConfig.variants.some(v => v.stock < 0);
    if (hasNegativeStock) {
      logger.validation.field('stock', 'variantes', false, 'Estoque negativo encontrado');
      allErrors.variants = 'Estoque não pode ser negativo';
    }

    const totalFields = 5;
    const validFields = totalFields - Object.keys(allErrors).length;
    logger.validation.summary(totalFields, validFields, allErrors);
    logger.groupEnd();

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
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
    validateAllSteps,
    submitForm,
    resetForm,
    transformToAPI,
  };
}
