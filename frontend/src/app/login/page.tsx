'use client';

import Image from 'next/image';
import Header from '@/components/layout/Header';
import { IMAGES } from '@/config/images';
import { useLoginForm } from './hooks/useLoginForm';
import LoginForm from './components/LoginForm';

/**
 * Página Login
 * 
 * Página de login - integrada com backend real
 */
export default function LoginPage() {
  const {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit,
    fillCredentials,
  } = useLoginForm();

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
          <LoginForm
            email={formData.email}
            password={formData.password}
            error={error}
            isLoading={isLoading}
            onEmailChange={(value) => handleChange('email', value)}
            onPasswordChange={(value) => handleChange('password', value)}
            onSubmit={handleSubmit}
            onFillCredentials={fillCredentials}
          />
        </div>
      </main>
    </>
  );
}
