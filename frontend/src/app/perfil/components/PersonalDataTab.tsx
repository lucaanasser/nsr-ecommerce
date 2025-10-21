import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatCPF, formatPhone, cleanNumericString, formatDateWhileTyping } from '../utils/formatters';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
}

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

interface PersonalDataTabProps {
  user: User | null;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isSaving: boolean;
  saveError: string;
  editData: EditData;
  passwordData: PasswordData;
  onEditDataChange: (field: keyof EditData, value: string) => void;
  onPasswordChange: (field: keyof PasswordData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteAccount: () => void;
}

/**
 * Componente da aba de dados pessoais do usuário
 */
export default function PersonalDataTab({
  user,
  isEditing,
  setIsEditing,
  isSaving,
  saveError,
  editData,
  passwordData,
  onEditDataChange,
  onPasswordChange,
  onSubmit,
  onDeleteAccount,
}: PersonalDataTabProps) {
  const handleCPFChange = (value: string) => {
    const cleaned = cleanNumericString(value);
    onEditDataChange('cpf', cleaned);
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanNumericString(value);
    onEditDataChange('phone', cleaned);
  };

  const handleBirthDateChange = (value: string) => {
    const formatted = formatDateWhileTyping(value);
    onEditDataChange('birthDate', formatted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Botão para habilitar/desabilitar edição */}
      <div className="mb-4 flex justify-start">
        <Button
          variant={isEditing ? 'ghost' : 'primary'}
          type="button"
          className="py-2 px-6"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancelar Edição' : 'Editar Dados'}
        </Button>
      </div>

      <form className="space-y-4 max-w-2xl" onSubmit={onSubmit}>
        {saveError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-sm text-sm">
            {saveError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder="Nome"
            value={isEditing ? editData.firstName : (user?.firstName || '')}
            onChange={(e) => onEditDataChange('firstName', e.target.value)}
            readOnly={!isEditing}
          />
          <Input
            type="text"
            placeholder="Sobrenome"
            value={isEditing ? editData.lastName : (user?.lastName || '')}
            onChange={(e) => onEditDataChange('lastName', e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <Input
          type="text"
          placeholder="CPF"
          value={isEditing ? formatCPF(editData.cpf) : formatCPF(user?.cpf || '')}
          onChange={(e) => handleCPFChange(e.target.value)}
          readOnly={!isEditing}
        />

        <Input
          type="email"
          placeholder="Email"
          value={isEditing ? editData.email : (user?.email || '')}
          onChange={(e) => onEditDataChange('email', e.target.value)}
          readOnly={!isEditing}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="tel"
            placeholder="Telefone"
            value={isEditing ? formatPhone(editData.phone) : formatPhone(user?.phone || '')}
            onChange={(e) => handlePhoneChange(e.target.value)}
            readOnly={!isEditing}
          />

          <Input
            type="text"
            placeholder="Data de Nascimento"
            value={editData.birthDate}
            onChange={(e) => handleBirthDateChange(e.target.value)}
            maxLength={10}
            readOnly={!isEditing}
          />
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-4 text-primary-white">Alterar Senha</h3>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Senha Atual"
              value={passwordData.currentPassword}
              onChange={(e) => onPasswordChange('currentPassword', e.target.value)}
              disabled={!isEditing}
            />
            <Input
              type="password"
              placeholder="Nova Senha"
              value={passwordData.newPassword}
              onChange={(e) => onPasswordChange('newPassword', e.target.value)}
              disabled={!isEditing}
            />
            <Input
              type="password"
              placeholder="Confirmar Nova Senha"
              value={passwordData.confirmNewPassword}
              onChange={(e) => onPasswordChange('confirmNewPassword', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="py-3 px-8"
          disabled={!isEditing || isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>

        {/* Link discreto para excluir conta */}
        <div className="mt-8 pt-4 border-t border-dark-border/30">
          <button
            type="button"
            onClick={onDeleteAccount}
            className="text-sm text-primary-white/40 hover:text-red-500 transition-colors underline"
          >
            Excluir minha conta
          </button>
        </div>
      </form>
    </motion.div>
  );
}
