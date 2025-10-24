/**
 * IncompleteDataView
 * View para usuários logados mas com dados incompletos (CPF/telefone)
 */

'use client';

import { Check } from 'lucide-react';
import CheckoutCompleteDataForm from '../../forms/CheckoutCompleteDataForm';
import type { AuthUser } from '@/services';

interface IncompleteDataViewProps {
  user: AuthUser;
  missingFields: string[];
  onComplete: (updatedUser: AuthUser) => void;
}

export default function IncompleteDataView({ user, missingFields, onComplete }: IncompleteDataViewProps) {
  return (
    <div className="space-y-6">
      {/* Dados existentes do usuário */}
      <div className="bg-dark-bg/30 border border-dark-border p-4 rounded-sm">
        <div className="flex items-center gap-2 mb-3">
          <Check className="text-green-500" size={18} />
          <span className="text-sm font-semibold">Dados cadastrados:</span>
        </div>
        <div className="space-y-1 text-sm text-primary-white/70">
          <p>• {user.firstName} {user.lastName}</p>
          <p>• {user.email}</p>
          {user.phone && <p>• {user.phone}</p>}
          {user.cpf && <p>• CPF: {user.cpf}</p>}
        </div>
      </div>

      {/* Formulário para completar dados */}
      <CheckoutCompleteDataForm 
        user={user}
        missingFields={missingFields}
        onComplete={onComplete}
      />
    </div>
  );
}
