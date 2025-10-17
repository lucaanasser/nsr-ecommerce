'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useAdmin } from '@/context/AdminContext';

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
            src="/images/background_login.png"
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
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-card/50 backdrop-blur-sm border border-dark-border px-4 py-3 text-primary-white placeholder:text-primary-white/40 focus:outline-none focus:border-primary-gold transition-colors rounded-sm"
                  placeholder="Email"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-card/50 backdrop-blur-sm border border-dark-border px-4 py-3 text-primary-white placeholder:text-primary-white/40 focus:outline-none focus:border-primary-gold transition-colors rounded-sm"
                  placeholder="Senha"
                  required
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
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-base font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
              
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
                <button
                  type="button"
                  onClick={() => fillCredentials('user')}
                  className="text-xs bg-dark-card/30 hover:bg-dark-card/50 border border-dark-border hover:border-primary-gold/50 text-primary-white/60 hover:text-primary-gold px-3 py-2 rounded-sm transition-all"
                >
                  👤 Usuário
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin1')}
                  className="text-xs bg-dark-card/30 hover:bg-dark-card/50 border border-dark-border hover:border-primary-gold/50 text-primary-white/60 hover:text-primary-gold px-3 py-2 rounded-sm transition-all"
                >
                  🔐 Sócio 1
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin2')}
                  className="text-xs bg-dark-card/30 hover:bg-dark-card/50 border border-dark-border hover:border-primary-bronze/50 text-primary-white/60 hover:text-primary-bronze px-3 py-2 rounded-sm transition-all"
                >
                  � Sócio 2
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
