'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { User, Lock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAdmin } from '@/context/AdminContext';
import { IMAGES } from '@/config/images';

/**
 * Página Login
 * 
 * Página de login - detecção automática de admin/usuário
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdmin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula delay de autenticação
    setTimeout(() => {
      const success = login(email, password);
      
      if (!success) {
        setError('Email ou senha inválidos');
        setIsLoading(false);
      }
      // Se sucesso, o redirect é feito pelo AdminContext
    }, 500);
  };

  // Preenche credenciais de exemplo para testes
  const fillCredentials = (type: 'user' | 'admin1' | 'admin2') => {
    if (type === 'user') {
      setEmail('usuario@nsr.com');
      setPassword('123456');
    } else if (type === 'admin1') {
      setEmail('admin@nsr.com');
      setPassword('admin123');
    } else {
      setEmail('socio@nsr.com');
      setPassword('socio123');
    }
    setError('');
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

        <div className="relative z-10 w-full max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-primary-bronze overflow-visible">
              Login
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="bg-dark-card/50 backdrop-blur-sm"
              />
              
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="ghost"
                  onClick={() => fillCredentials('user')}
                  className="text-xs py-2 px-3"
                >
                  <User size={12} className="mr-1" /> Usuário
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => fillCredentials('admin1')}
                  className="text-xs py-2 px-3"
                >
                  <Lock size={12} className="mr-1" /> Sócio 1
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => fillCredentials('admin2')}
                  className="text-xs py-2 px-3"
                >
                  <Lock size={12} className="mr-1" /> Sócio 2
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
