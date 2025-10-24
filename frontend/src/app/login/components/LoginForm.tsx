import { FormEvent } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onFillCredentials: (type: 'user' | 'admin') => void;
}

export default function LoginForm({
  email,
  password,
  error,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onFillCredentials,
}: LoginFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-primary-bronze overflow-visible font-nsr">
        Login
      </h1>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Email"
          required
          className="bg-dark-card/50 backdrop-blur-sm"
        />
        
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Senha"
          required
          className="bg-dark-card/50 backdrop-blur-sm"
        />

        {/* Mensagem de erro */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-sm text-sm text-center"
          >
            {error}
          </motion.div>
        )}
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
        
        <p className="text-center text-xs text-primary-white/50 pt-2">
          Não tem conta? <Link href="/cadastro" className="text-primary-gold hover:underline">Cadastre-se</Link>
        </p>
      </form>

      {/* Credenciais de teste - apenas para desenvolvimento */}
      <div className="mt-8 pt-6 border-t border-dark-border">
        <p className="text-xs text-primary-white/40 text-center mb-3">
          Credenciais para teste:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            onClick={() => onFillCredentials('user')}
            className="text-xs py-2 px-3"
          >
            <User size={12} className="mr-1" /> Cliente
          </Button>
          <Button
            variant="ghost"
            onClick={() => onFillCredentials('admin')}
            className="text-xs py-2 px-3"
          >
            <Lock size={12} className="mr-1" /> Admin
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
