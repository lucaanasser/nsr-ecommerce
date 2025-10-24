/**
 * CheckoutRegisterForm
 * Formulário de cadastro adaptado para o contexto do checkout
 * Mantém a estética do checkout e não redireciona para outras páginas
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import { authService, getErrorMessage } from '@/services';
import type { AuthUser } from '@/services';

interface CheckoutRegisterFormProps {
  onRegisterSuccess: (user: AuthUser) => void;
  onSwitchToLogin: () => void;
}

export default function CheckoutRegisterForm({ onRegisterSuccess, onSwitchToLogin }: CheckoutRegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const [consents, setConsents] = useState({
    privacyPolicy: false,
    terms: false,
    marketing: false, // Opcional
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    // Formata enquanto digita: dd/MM/yyyy
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setFormData(prev => ({ ...prev, birthDate: value }));
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConsents(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!consents.privacyPolicy || !consents.terms) {
      setError('Você precisa aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }

    // Validar formato da data (dd/MM/yyyy)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dateMatch = formData.birthDate.match(dateRegex);
    if (!dateMatch) {
      setError('Data de nascimento inválida. Use o formato dd/MM/aaaa.');
      return;
    }

    // Converter data brasileira para ISO (yyyy-MM-dd)
    const [, day, month, year] = dateMatch;
    const isoDate = `${year}-${month}-${day}`;

    setIsLoading(true);

    try {
      // Se já existe um usuário logado, fazer logout primeiro
      if (authService.isAuthenticated()) {
        console.log('[CheckoutRegisterForm] Usuário já logado, fazendo logout primeiro');
        await authService.logout();
      }

      // Registrar usuário
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        birthDate: isoDate,
        privacyPolicy: consents.privacyPolicy,
        terms: consents.terms,
        marketing: consents.marketing,
      });

      // Fazer login automático
      const loginResponse = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse.user) {
        console.log('✅ Cadastro bem-sucedido, usuário logado:', loginResponse.user);
        
        // Atualizar com CPF e telefone se fornecidos
        if (formData.cpf || formData.phone) {
          const updateData: any = {};
          if (formData.cpf) updateData.cpf = formData.cpf;
          if (formData.phone) updateData.phone = formData.phone;
          
          console.log('📝 Atualizando CPF/telefone:', updateData);
          await authService.updateProfile(updateData);
          
          // Buscar usuário atualizado
          const updatedUser = await authService.getProfile();
          console.log('✅ Usuário atualizado:', updatedUser);
          onRegisterSuccess(updatedUser);
        } else {
          console.log('⚠️ CPF/telefone não fornecidos no cadastro');
          onRegisterSuccess(loginResponse.user);
        }
      }
    } catch (err: any) {
      console.error('[CheckoutRegisterForm] Erro ao criar conta:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 p-3 rounded-sm text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            name="firstName"
            placeholder="Nome"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="bg-dark-bg/50"
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Sobrenome"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="bg-dark-bg/50"
          />
        </div>

        <Input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-dark-bg/50"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="tel"
            name="phone"
            placeholder="Telefone (opcional)"
            value={formData.phone}
            onChange={handleChange}
            className="bg-dark-bg/50"
          />
          <Input
            type="text"
            name="cpf"
            placeholder="CPF (opcional)"
            value={formData.cpf}
            onChange={handleChange}
            className="bg-dark-bg/50"
          />
        </div>

        <Input
          type="text"
          name="birthDate"
          placeholder="Data de Nascimento (dd/MM/aaaa)"
          value={formData.birthDate}
          onChange={handleBirthDateChange}
          required
          maxLength={10}
          className="bg-dark-bg/50"
        />

        <div className="border-t border-dark-border pt-4 mt-4">
          <p className="text-sm font-semibold mb-4">Crie uma senha:</p>
          
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-dark-bg/50"
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-dark-bg/50"
            />
          </div>

          {/* Indicador de força da senha */}
          <PasswordStrengthIndicator
            password={formData.password}
            confirmPassword={formData.confirmPassword}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="privacyPolicy"
              checked={consents.privacyPolicy}
              onChange={handleConsentChange}
              required
              className="mt-1 w-4 h-4 accent-primary-bronze"
            />
            <label className="text-xs text-primary-white/70">
              Li e aceito a{' '}
              <a href="/politica-privacidade" target="_blank" className="text-primary-bronze hover:underline">
                Política de Privacidade
              </a>
              {' '}<span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="terms"
              checked={consents.terms}
              onChange={handleConsentChange}
              required
              className="mt-1 w-4 h-4 accent-primary-bronze"
            />
            <label className="text-xs text-primary-white/70">
              Li e aceito os{' '}
              <a href="/termos-uso" target="_blank" className="text-primary-bronze hover:underline">
                Termos de Uso
              </a>
              {' '}<span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="marketing"
              checked={consents.marketing}
              onChange={handleConsentChange}
              className="mt-1 w-4 h-4 accent-primary-bronze"
            />
            <label className="text-xs text-primary-white/70">
              Quero receber ofertas exclusivas e novidades por email
            </label>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta e Continuar'}
        </Button>
      </form>
    </div>
  );
}
