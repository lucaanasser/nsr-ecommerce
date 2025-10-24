/**
 * Etapa 1: Seus Dados
 * Gerencia 3 estados:
 * 1. Usuário não logado (login/cadastro)
 * 2. Usuário logado com dados incompletos (completar CPF/telefone)
 * 3. Usuário logado com dados completos (continuar)
 */

'use client';

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import type { AuthUser } from '@/services';

// Sub-views
import NotLoggedView from './dados-substeps/NotLoggedView';
import IncompleteDataView from './dados-substeps/IncompleteDataView';
import CompleteDataView from './dados-substeps/CompleteDataView';

interface DadosStepProps {
  user: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onRegisterSuccess: (user: AuthUser) => void;
  onCompleteData: (user: AuthUser) => void;
  onContinue: () => void;
}

export default function DadosStep({
  user,
  onLoginSuccess,
  onRegisterSuccess,
  onCompleteData,
  onContinue,
}: DadosStepProps) {
  // Determinar campos faltantes
  const getMissingFields = (): string[] => {
    if (!user) return [];
    
    // Verificar campos faltantes
    const needsCpf = !user.cpf || user.cpf.trim() === '';
    const needsPhone = !user.phone || user.phone.trim() === '';

    const missing: string[] = [];
    if (needsCpf) missing.push('CPF');
    if (needsPhone) missing.push('Telefone');

    console.log('[DadosStep] Verificando dados do usuário:', {
      'user.cpf': user.cpf,
      'user.cpf type': typeof user.cpf,
      'user.cpf length': user.cpf?.length,
      'user.phone': user.phone,
      'user.phone type': typeof user.phone,
      'user.phone length': user.phone?.length,
      needsCpf,
      needsPhone,
      'missing fields': missing
    });
    
    return missing;
  };

  const missingFields = getMissingFields();
  const isDataComplete = user && missingFields.length === 0;

  // Determinar qual view renderizar
  const renderView = () => {
    // Estado 1: Não logado
    if (!user) {
      return (
        <NotLoggedView 
          onLoginSuccess={onLoginSuccess}
          onRegisterSuccess={onRegisterSuccess}
        />
      );
    }

    // Estado 2: Logado mas dados incompletos
    if (missingFields.length > 0) {
      return (
        <IncompleteDataView 
          user={user}
          missingFields={missingFields}
          onComplete={onCompleteData}
        />
      );
    }

    // Estado 3: Logado com dados completos
    return (
      <CompleteDataView 
        user={user}
        onContinue={onContinue}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-card border border-dark-border p-6 rounded-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <Package className="text-primary-bronze" size={24} />
        <h2 className="text-2xl font-semibold">Seus Dados</h2>
      </div>
      <p className="text-xs text-primary-white/50 mb-6">
        Quem está realizando a compra (para nota fiscal)
      </p>

      {renderView()}
    </motion.div>
  );
}
