/**
 * CheckoutCompleteDataForm
 * Formulário para completar dados faltantes (CPF/telefone)
 * Baseado na lógica de PersonalDataTab, mas adaptado para o checkout
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authService, getErrorMessage } from '@/services';
import type { AuthUser } from '@/services';

// Funções de formatação (reutilizadas do perfil)
const cleanNumericString = (value: string): string => {
  return value.replace(/\D/g, '');
};

const formatCPF = (value: string): string => {
  const cleaned = cleanNumericString(value);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

const formatPhone = (value: string): string => {
  const cleaned = cleanNumericString(value);
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

interface CheckoutCompleteDataFormProps {
  user: AuthUser;
  missingFields: string[];
  onComplete: (updatedUser: AuthUser) => void;
}

export default function CheckoutCompleteDataForm({ 
  user, 
  missingFields, 
  onComplete 
}: CheckoutCompleteDataFormProps) {
  const [cpf, setCpf] = useState(user.cpf || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const needsCpf = missingFields.includes('cpf') || missingFields.includes('CPF');
  const needsPhone = missingFields.includes('telefone') || missingFields.includes('Telefone') || missingFields.includes('phone');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar campos obrigatórios
    if (needsCpf && (!cpf || cleanNumericString(cpf).length === 0)) {
      setError('CPF é obrigatório.');
      return;
    }

    if (needsPhone && (!phone || cleanNumericString(phone).length === 0)) {
      setError('Telefone é obrigatório.');
      return;
    }

    setIsLoading(true);

    try {
      if (saveToProfile) {
        // Atualizar perfil do usuário
        const updateData: any = {};
        if (needsCpf) updateData.cpf = cleanNumericString(cpf);
        if (needsPhone) updateData.phone = cleanNumericString(phone);

        console.log('📝 Salvando dados no perfil:', updateData);
        const updatedUser = await authService.updateProfile(updateData);
        console.log('✅ Dados salvos com sucesso:', updatedUser);
        onComplete(updatedUser);
      } else {
        // Apenas prosseguir sem salvar (dados temporários para esta compra)
        const tempUser = { ...user };
        if (needsCpf) tempUser.cpf = cleanNumericString(cpf);
        if (needsPhone) tempUser.phone = cleanNumericString(phone);
        console.log('⚠️ Dados temporários (não salvos):', tempUser);
        onComplete(tempUser);
      }
    } catch (err: any) {
      console.error('❌ Erro ao salvar dados:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary-gold/10 border border-primary-gold/30 p-4 rounded-sm mb-4">
        <p className="text-sm text-primary-white/80 mb-3">
          Complete seus dados para prosseguir com a compra:
        </p>
        <ul className="list-disc list-inside text-xs text-primary-white/70 space-y-1">
          {missingFields.map((campo) => (
            <li key={campo}>{campo}</li>
          ))}
        </ul>
      </div>

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

        {needsCpf && (
          <Input
            type="text"
            placeholder="CPF"
            value={formatCPF(cpf)}
            onChange={(e) => setCpf(cleanNumericString(e.target.value))}
            required
            maxLength={14}
            className="bg-dark-bg/50"
          />
        )}

        {needsPhone && (
          <Input
            type="tel"
            placeholder="Telefone"
            value={formatPhone(phone)}
            onChange={(e) => setPhone(cleanNumericString(e.target.value))}
            required
            maxLength={15}
            className="bg-dark-bg/50"
          />
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            checked={saveToProfile}
            onChange={(e) => setSaveToProfile(e.target.checked)}
            className="w-4 h-4 accent-primary-bronze"
          />
          <label className="text-sm text-primary-white/70">
            Salvar estes dados no meu perfil para próximas compras
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Continuar para Entrega'}
        </Button>
      </form>
    </div>
  );
}
