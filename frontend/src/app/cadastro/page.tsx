'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthContext } from '@/context/AuthContext';
import { getErrorMessage } from '@/services';
import { IMAGES } from '@/config/images';

/**
 * Página Cadastro
 * 
 * Página de cadastro minimalista - integrada com backend real
 */
export default function CadastroPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });
  const [consents, setConsents] = useState({
    privacyPolicy: false,
    terms: false,
    marketing: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthContext();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Validar consentimentos obrigatórios
    if (!consents.privacyPolicy) {
      setError('Você deve aceitar a Política de Privacidade');
      return;
    }

    if (!consents.terms) {
      setError('Você deve aceitar os Termos de Uso');
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword,
        consents
      );
      
      // Após cadastro bem-sucedido, redirecionar para perfil
      router.push('/perfil');
    } catch (err) {
      setError(getErrorMessage(err));
      setIsLoading(false);
    }
  };
  return (
    <>
      <Header />
      
  <main className="h-screen w-full flex items-center justify-center relative overflow-hidden">
        {/* Imagem de fundo */}
        <div className="fixed inset-0 z-0">
          <Image
            src={IMAGES.backgroundLogin}
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Overlay escuro para fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/85 to-dark-bg/90" />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-primary-bronze overflow-visible font-nsr">
              Cadastro
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
              </div>
              
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefone (opcional)"
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
                
                <Input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  placeholder="Data de Nascimento"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Senha (mín. 6 caracteres)"
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
                    onChange={handleChange}
                    placeholder="Confirmar Senha"
                    required
                    className="bg-dark-card/50 backdrop-blur-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-bronze text-sm">*</span>
                </div>
              </div>

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

              {/* LGPD - Consentimentos */}
              <div className="space-y-3 pt-4 border-t border-primary-white/10">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consents.privacyPolicy && consents.terms}
                    onChange={(e) => setConsents({ 
                      ...consents, 
                      privacyPolicy: e.target.checked,
                      terms: e.target.checked 
                    })}
                    className="mt-1 w-4 h-4 accent-primary-gold"
                    required
                  />
                  <span className="text-xs text-primary-white/70 group-hover:text-primary-white/90 transition-colors">
                    Li e aceito a{' '}
                    <Link href="/politica-privacidade" target="_blank" className="text-primary-gold hover:underline font-medium">
                      Política de Privacidade
                    </Link>
                    {' '}e os{' '}
                    <Link href="/termos-uso" target="_blank" className="text-primary-gold hover:underline font-medium">
                      Termos de Uso
                    </Link>
                    {' '}<span className="text-primary-bronze">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consents.marketing}
                    onChange={(e) => setConsents({ ...consents, marketing: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-primary-gold"
                  />
                  <span className="text-xs text-primary-white/70 group-hover:text-primary-white/90 transition-colors">
                    Quero receber ofertas exclusivas e novidades por email
                  </span>
                </label>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6"
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
              
              <p className="text-center text-xs text-primary-white/50 pt-2">
                Já tem conta? <Link href="/login" className="text-primary-gold hover:underline">Faça login</Link>
              </p>
            </form>
          </motion.div>
        </div>
      </main>
    </>
  );
}
