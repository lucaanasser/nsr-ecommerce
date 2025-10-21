import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { authService } from '@/services';
import { convertBirthDateToISO, formatBirthDate } from '../utils/formatters';

interface EditData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * Hook personalizado para gerenciar dados do perfil do usuário
 */
export function useProfileData() {
  const { user, refreshUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [editData, setEditData] = useState<EditData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Preenche os estados quando entra em modo de edição
  useEffect(() => {
    if (isEditing && user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        cpf: user.cpf || '',
        birthDate: formatBirthDate(user.birthDate) || '',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setSaveError('');
    }
  }, [isEditing, user]);

  const updateEditData = (field: keyof EditData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const updatePasswordData = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const validateData = (): string | null => {
    // Nome e sobrenome obrigatórios
    if (!editData.firstName.trim() || !editData.lastName.trim()) {
      return 'Nome e sobrenome são obrigatórios';
    }

    // Email obrigatório e válido
    if (!editData.email.trim()) {
      return 'Email é obrigatório';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      return 'Email inválido';
    }

    // CPF válido se fornecido
    if (editData.cpf && editData.cpf.replace(/\D/g, '').length !== 11) {
      return 'CPF deve ter 11 dígitos';
    }

    // Telefone válido se fornecido
    if (editData.phone) {
      const phoneClean = editData.phone.replace(/\D/g, '');
      if (phoneClean.length !== 10 && phoneClean.length !== 11) {
        return 'Telefone inválido';
      }
    }

    // Data de nascimento válida
    if (editData.birthDate) {
      const isoDate = convertBirthDateToISO(editData.birthDate);
      if (!isoDate) {
        return 'Data de nascimento inválida';
      }
    }

    // Validação de senha se fornecida
    if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmNewPassword) {
      if (!passwordData.currentPassword) {
        return 'Digite sua senha atual para alterá-la';
      }
      if (!passwordData.newPassword) {
        return 'Digite a nova senha';
      }
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        return 'As senhas não coincidem';
      }
      if (passwordData.newPassword.length < 8) {
        return 'A nova senha deve ter no mínimo 8 caracteres';
      }
    }

    return null;
  };

  const saveChanges = async (): Promise<void> => {
    setIsSaving(true);
    setSaveError('');

    try {
      // Preparar dados para atualização de perfil
      const profileData: any = {
        firstName: editData.firstName.trim(),
        lastName: editData.lastName.trim(),
        email: editData.email.trim().toLowerCase(),
      };

      if (editData.phone) {
        profileData.phone = editData.phone.replace(/\D/g, '');
      }

      if (editData.cpf) {
        profileData.cpf = editData.cpf.replace(/\D/g, '');
      }

      if (editData.birthDate) {
        const isoDate = convertBirthDateToISO(editData.birthDate);
        if (isoDate) {
          profileData.birthDate = isoDate;
        }
      }

      // Atualizar perfil
      await authService.updateProfile(profileData);

      // Atualizar senha se fornecida
      if (passwordData.currentPassword && passwordData.newPassword) {
        await authService.changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmNewPassword,
        });
      }

      // Atualizar contexto do usuário
      await refreshUser();

      // Desabilitar modo de edição
      setIsEditing(false);
      
      // Limpar campos de senha
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });

      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao salvar alterações:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao salvar alterações';
      setSaveError(errorMessage);
      setIsEditing(true);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    isEditing,
    setIsEditing,
    isSaving,
    saveError,
    setSaveError,
    editData,
    passwordData,
    updateEditData,
    updatePasswordData,
    validateData,
    saveChanges,
  };
}
