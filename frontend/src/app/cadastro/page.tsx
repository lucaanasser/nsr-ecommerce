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
    password: '',
    confirmPassword: '',
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

    setIsLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      
      // Redirecionar para loja após cadastro bem-sucedido
      router.push('/loja');
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
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-primary-bronze overflow-visible">
              Cadastro
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome completo"
                required
                className="bg-dark-card/50 backdrop-blur-sm"
              />
              
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="bg-dark-card/50 backdrop-blur-sm"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Senha (mín. 6 caracteres)"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
                
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmar Senha"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
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
