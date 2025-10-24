/**
 * Componente visual para indicar a força da senha em tempo real
 * Mostra regras que devem ser seguidas e valida conforme o usuário digita
 */

'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordRule {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  confirmPassword?: string;
  className?: string;
}

const PASSWORD_RULES: PasswordRule[] = [
  {
    label: 'Mínimo de 8 caracteres',
    test: (pwd) => pwd.length >= 8,
  },
  {
    label: 'Pelo menos 1 letra maiúscula (A-Z)',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: 'Pelo menos 1 letra minúscula (a-z)',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: 'Pelo menos 1 número (0-9)',
    test: (pwd) => /\d/.test(pwd),
  },
  {
    label: 'Pelo menos 1 caractere especial (!@#$%...)',
    test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  },
];

const OBVIOUS_PASSWORDS = [
  'senha123', 'senha!123', 'senha@123', 'senha#123',
  'abcde!123', 'abcde@123', 'abcde#123', 'abcde$123',
  'abc123!', 'abc123@', 'abc123#', 'abc123$',
  'password!', 'password@', 'password#', 'password$',
  'password!123', 'password@123', 'password#123',
  'qwerty123', 'qwerty!123', 'qwerty@123',
  '12345678!', '12345678@', '12345678#',
];

export default function PasswordStrengthIndicator({
  password,
  confirmPassword,
  className = '',
}: PasswordStrengthIndicatorProps) {
  const validations = useMemo(() => {
    const results = PASSWORD_RULES.map((rule) => ({
      label: rule.label,
      passed: rule.test(password),
    }));

    // Adiciona validação de senha óbvia
    const isObvious = password.length > 0 && OBVIOUS_PASSWORDS.includes(password.toLowerCase());
    results.push({
      label: 'Não ser uma senha óbvia (ex: Senha!123, Abcde!123)',
      passed: !isObvious,
    });

    // Adiciona validação de sequências
    const hasSequence = password.length > 0 && (
      /(.)\1{2,}/.test(password) ||
      /012|123|234|345|456|567|678|789/.test(password) ||
      /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)
    );
    results.push({
      label: 'Não conter sequências óbvias (abc, 123) ou repetições (aaa)',
      passed: !hasSequence,
    });

    // Adiciona validação de confirmação de senha
    if (confirmPassword !== undefined && confirmPassword.length > 0) {
      results.push({
        label: 'As senhas coincidem',
        passed: password === confirmPassword,
      });
    }

    return results;
  }, [password, confirmPassword]);

  const passedCount = validations.filter((v) => v.passed).length;
  const totalCount = validations.length;
  const strength = (passedCount / totalCount) * 100;

  // Não mostra nada se a senha estiver vazia
  if (password.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`mt-3 space-y-3 ${className}`}
    >
      {/* Barra de progresso */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-primary-white/60">Força da senha</span>
          <span className={`font-medium ${
            strength < 40 ? 'text-red-400' :
            strength < 70 ? 'text-yellow-400' :
            strength < 100 ? 'text-blue-400' :
            'text-green-400'
          }`}>
            {strength < 40 ? 'Fraca' :
             strength < 70 ? 'Média' :
             strength < 100 ? 'Boa' :
             'Forte'}
          </span>
        </div>
        <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full rounded-full ${
              strength < 40 ? 'bg-red-500' :
              strength < 70 ? 'bg-yellow-500' :
              strength < 100 ? 'bg-blue-500' :
              'bg-green-500'
            }`}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      <div className="space-y-1.5">
        <p className="text-xs text-primary-white/60 font-medium">Requisitos da senha:</p>
        <AnimatePresence mode="popLayout">
          {validations.map((validation, index) => (
            <motion.div
              key={validation.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-2"
            >
              <span className={`mt-0.5 flex-shrink-0 ${
                validation.passed ? 'text-green-400' : 'text-red-400/70'
              }`}>
                {validation.passed ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  <X size={14} strokeWidth={2.5} />
                )}
              </span>
              <span className={`text-xs ${
                validation.passed
                  ? 'text-primary-white/90 line-through'
                  : 'text-primary-white/60'
              }`}>
                {validation.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
