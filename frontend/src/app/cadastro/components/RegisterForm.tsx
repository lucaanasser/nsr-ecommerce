import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface RegisterFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    password: string;
    confirmPassword: string;
  };
  consents: {
    privacyPolicy: boolean;
    terms: boolean;
    marketing: boolean;
  };
  error: string;
  isLoading: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConsentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Componente de formulário de cadastro
 */
export default function RegisterForm({
  formData,
  consents,
  error,
  isLoading,
  onFormChange,
  onConsentChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-primary-bronze overflow-visible font-nsr">
        Cadastro
      </h1>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nome e Sobrenome */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onFormChange}
              placeholder="Nome"
              required
              className="bg-dark-card/50 backdrop-blur-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
          </div>
          
          <div className="relative">
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onFormChange}
              placeholder="Sobrenome"
              required
              className="bg-dark-card/50 backdrop-blur-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
          </div>
        </div>
        
        {/* Email */}
        <div className="relative">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={onFormChange}
            placeholder="Email"
            required
            className="bg-dark-card/50 backdrop-blur-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
        </div>

        {/* Telefone e Data de Nascimento */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onFormChange}
            placeholder="Telefone (opcional)"
            className="bg-dark-card/50 backdrop-blur-sm"
          />
          
          <div className="relative">
            <Input
              type="text"
              name="birthDate"
              value={formData.birthDate}
              onChange={onFormChange}
              placeholder="Data de Nascimento"
              maxLength={10}
              required
              className="bg-dark-card/50 backdrop-blur-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
          </div>
        </div>

        {/* Senhas */}
        <div className="relative">
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={onFormChange}
            placeholder="Senha"
            required
            className="bg-dark-card/50 backdrop-blur-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
        </div>
        
        <div className="relative">
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onFormChange}
            placeholder="Confirmar Senha"
            required
            className="bg-dark-card/50 backdrop-blur-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
        </div>

        {/* Consentimentos */}
        <div className="space-y-3 pt-2">
          {/* Política de Privacidade */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="privacyPolicy"
              checked={consents.privacyPolicy}
              onChange={onConsentChange}
              className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-card/50 text-primary-bronze focus:ring-primary-bronze focus:ring-offset-0 cursor-pointer"
              required
            />
            <span className="text-sm text-primary-white/70 group-hover:text-primary-white transition-colors">
              Li e aceito a{' '}
              <Link href="/politica-privacidade" className="text-primary-bronze hover:underline">
                Política de Privacidade
              </Link>
              {' '}*
            </span>
          </label>

          {/* Termos de Uso */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="terms"
              checked={consents.terms}
              onChange={onConsentChange}
              className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-card/50 text-primary-bronze focus:ring-primary-bronze focus:ring-offset-0 cursor-pointer"
              required
            />
            <span className="text-sm text-primary-white/70 group-hover:text-primary-white transition-colors">
              Li e aceito os{' '}
              <Link href="/termos-de-uso" className="text-primary-bronze hover:underline">
                Termos de Uso
              </Link>
              {' '}*
            </span>
          </label>

          {/* Marketing (opcional) */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="marketing"
              checked={consents.marketing}
              onChange={onConsentChange}
              className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-card/50 text-primary-bronze focus:ring-primary-bronze focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-primary-white/70 group-hover:text-primary-white transition-colors">
              Aceito receber comunicações de marketing (opcional)
            </span>
          </label>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-sm text-sm">
            {error}
          </div>
        )}

        {/* Botão de Submit */}
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="w-full py-4 text-lg font-semibold"
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </Button>

        {/* Link para Login */}
        <p className="text-center text-sm text-primary-white/60 mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary-bronze hover:underline font-semibold">
            Faça login
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
