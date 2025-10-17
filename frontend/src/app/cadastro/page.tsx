'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { IMAGES } from '@/config/images';

/**
 * Página Cadastro
 * 
 * Página de cadastro minimalista
 */
export default function CadastroPage() {
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
            
            <form className="space-y-4">
              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="Nome"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
                
                <Input
                  type="text"
                  placeholder="Sobrenome"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
              </div>
              
              <Input
                type="email"
                placeholder="Email"
                required
                className="bg-dark-card/50 backdrop-blur-sm"
              />
              
              <Input
                type="tel"
                placeholder="Telefone"
                required
                className="bg-dark-card/50 backdrop-blur-sm"
              />
              
              {/* Gênero e Aniversário */}
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="w-full bg-dark-card/50 backdrop-blur-sm border border-dark-border px-4 py-3 text-primary-white/40 focus:outline-none focus:border-primary-gold transition-colors rounded-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Gênero</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="nao-informar">Prefiro não informar</option>
                </select>
                
                <Input
                  type="date"
                  placeholder="Aniversário"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="password"
                  placeholder="Senha"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
                
                <Input
                  type="password"
                  placeholder="Confirmar Senha"
                  required
                  className="bg-dark-card/50 backdrop-blur-sm"
                />
              </div>
              
              {/* Checkbox para receber anúncios */}
              <Input
                type="checkbox"
                id="receberAnuncios"
                label="Desejo receber anúncios, novidades e promoções exclusivas por email"
                containerClassName="pt-2"
              />
              
              <Button
                type="submit"
                className="w-full mt-6"
              >
                Criar Conta
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
