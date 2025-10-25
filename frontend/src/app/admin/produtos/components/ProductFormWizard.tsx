'use client';

import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useProductForm } from '../hooks/useProductForm';
import StepIndicator, { Step } from './StepIndicator';
import BasicInfoStep from './form-steps/BasicInfoStep';
import DescriptionStep from './form-steps/DescriptionStep';
import ImagesStep from './form-steps/ImagesStep';
import VariantsStep from './form-steps/VariantsStep';
import ReviewStep from './form-steps/ReviewStep';

/**
 * Definição dos steps do wizard
 */
const STEPS: Step[] = [
  { id: 0, label: 'Informações Básicas', shortLabel: 'Básico' },
  { id: 1, label: 'Descrição', shortLabel: 'Descrição' },
  { id: 2, label: 'Imagens', shortLabel: 'Imagens' },
  { id: 3, label: 'Tamanhos e Cores', shortLabel: 'Variantes' },
  { id: 4, label: 'Revisão', shortLabel: 'Revisão' },
];

interface ProductFormWizardProps {
  initialData?: Partial<import('../hooks/useProductForm').ProductFormData>;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

/**
 * Componente principal do formulário wizard
 * Suporta modo de criação e edição
 */
export default function ProductFormWizard({
  initialData,
  onSuccess,
  onCancel,
  isEditMode = false,
}: ProductFormWizardProps) {
  const {
    formData,
    currentStep,
    errors,
    isSaving,
    updateField,
    updateName,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    submitForm,
  } = useProductForm(initialData);

  // Handler para avançar
  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  // Handler para finalizar
  const handleFinish = async () => {
    const result = await submitForm();
    
    if (result.success) {
      onSuccess?.(result.data);
    } else {
      alert(`Erro ao salvar: ${result.error}`);
    }
  };

  // Renderizar step atual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
            onUpdateName={updateName}
          />
        );
      
      case 1:
        return (
          <DescriptionStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
          />
        );
      
      case 2:
        return (
          <ImagesStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
          />
        );
      
      case 3:
        return (
          <VariantsStep
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
          />
        );
      
      case 4:
        return <ReviewStep formData={formData} />;
      
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="space-y-8">
      {/* Indicador de Progresso */}
      <StepIndicator
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      {/* Conteúdo do Step Atual */}
      <div className="bg-dark-card/50 border border-dark-border rounded-sm p-6 md:p-8">
        {renderCurrentStep()}
      </div>

      {/* Navegação */}
      <div className="flex items-center justify-between gap-4">
        {/* Botão Voltar / Cancelar */}
        {isFirstStep ? (
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-primary-white/60 hover:text-primary-white"
          >
            Cancelar
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>
        )}

        {/* Botão Próximo / Finalizar */}
        {isLastStep ? (
          <Button
            variant="primary"
            onClick={handleFinish}
            disabled={isSaving}
            className="flex items-center gap-2 px-6"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                {isEditMode ? 'Salvando...' : 'Publicando...'}
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditMode ? 'Salvar Alterações' : 'Publicar Produto'}
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            className="flex items-center gap-2 px-6"
          >
            Próximo
            <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
