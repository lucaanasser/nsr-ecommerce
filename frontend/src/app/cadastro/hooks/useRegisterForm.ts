import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { getErrorMessage } from '@/services';
import { formatDateToISO, validateAge, formatBirthDateWhileTyping } from '../utils/dateValidation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
}

interface Consents {
  privacyPolicy: boolean;
  terms: boolean;
  marketing: boolean;
}

/**
 * Hook customizado para gerenciar o formulário de cadastro
 */
export function useRegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const [consents, setConsents] = useState<Consents>({
    privacyPolicy: false,
    terms: false,
    marketing: false,
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthContext();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Tratamento especial para data de nascimento com máscara
    if (name === 'birthDate') {
      const formatted = formatBirthDateWhileTyping(value);
      setFormData(prev => ({ ...prev, birthDate: formatted }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConsents(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): string | null => {
    // Validação de senhas
    if (formData.password !== formData.confirmPassword) {
      return 'As senhas não coincidem';
    }

    if (formData.password.length < 6) {
      return 'A senha deve ter no mínimo 6 caracteres';
    }

    // Validação de data de nascimento
    const isoDate = formatDateToISO(formData.birthDate);
    const ageValidation = validateAge(isoDate);
    if (!ageValidation.valid) {
      return ageValidation.message || 'Data de nascimento inválida';
    }

    // Validação de consentimentos obrigatórios
    if (!consents.privacyPolicy) {
      return 'Você deve aceitar a Política de Privacidade';
    }

    if (!consents.terms) {
      return 'Você deve aceitar os Termos de Uso';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar formulário
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const isoDate = formatDateToISO(formData.birthDate);
      
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.confirmPassword,
        isoDate,
        consents
      );
      
      // Redirecionar para perfil após sucesso
      router.push('/perfil');
    } catch (err) {
      setError(getErrorMessage(err));
      setIsLoading(false);
    }
  };

  return {
    formData,
    consents,
    error,
    isLoading,
    handleChange,
    handleConsentChange,
    handleSubmit,
  };
}
