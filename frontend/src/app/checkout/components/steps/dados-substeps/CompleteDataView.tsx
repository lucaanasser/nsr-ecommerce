/**
 * CompleteDataView
 * View para usuários logados com todos os dados completos
 */

'use client';

import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { AuthUser } from '@/services';

interface CompleteDataViewProps {
  user: AuthUser;
  onContinue: () => void;
}

export default function CompleteDataView({ user, onContinue }: CompleteDataViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-sm">
        <div className="flex items-center gap-2 mb-4">
          <Check className="text-green-500" size={24} />
          <span className="text-lg font-semibold">Dados completos</span>
        </div>
        <div className="space-y-2 text-sm text-primary-white/80">
          <p className="font-medium">{user.firstName} {user.lastName}</p>
          <p>{user.email}</p>
          <p>{user.phone} • CPF: {user.cpf}</p>
        </div>
      </div>

      <Button 
        onClick={onContinue}
        className="w-full"
      >
        Continuar para Entrega
      </Button>
    </div>
  );
}
