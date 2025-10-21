'use client';

import Image from 'next/image';
import Header from '@/components/layout/Header';
import { IMAGES } from '@/config/images';
import { useRegisterForm } from './hooks/useRegisterForm';
import RegisterForm from './components/RegisterForm';

/**
 * Página de Cadastro - Versão Refatorada e Modular
 * 
 * Permite que novos usuários criem uma conta na plataforma
 */
export default function CadastroPage() {
  const registerForm = useRegisterForm();

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

        {/* Conteúdo */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8">
          <RegisterForm
            formData={registerForm.formData}
            consents={registerForm.consents}
            error={registerForm.error}
            isLoading={registerForm.isLoading}
            onFormChange={registerForm.handleChange}
            onConsentChange={registerForm.handleConsentChange}
            onSubmit={registerForm.handleSubmit}
          />
        </div>
      </main>
    </>
  );
}
