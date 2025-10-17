'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { VIDEOS, VIDEO_POSTERS } from '@/config/videos';

/**
 * Página Inicial
 * 
 * Landing page minimalista com vídeo fullscreen,
 * logo árabe em destaque e menu de navegação simples.
 */
export default function Inicio() {
  const referenciaVideo = useRef<HTMLVideoElement>(null);
  const [estaReproduzindo, setEstaReproduzindo] = useState(true);

  const itensMenu = [
    { label: 'Shop', href: '/loja' },
    { label: 'Login', href: '/login' },
    { label: 'Lookbook', href: '/lookbook' },
    { label: 'Sobre', href: '/sobre' },
  ];

  const alternarVideo = () => {
    if (referenciaVideo.current) {
      if (estaReproduzindo) {
        referenciaVideo.current.pause();
      } else {
        referenciaVideo.current.play();
      }
      setEstaReproduzindo(!estaReproduzindo);
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* Vídeo de Fundo */}
      <div className="absolute inset-0 z-0">
        <video
          ref={referenciaVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={VIDEO_POSTERS.landpage}
          className="w-full h-full object-cover"
          src={VIDEOS.landpage}
        >
          Seu navegador não suporta vídeos.
        </video>
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-dark-bg/50" />
      </div>

      {/* Controle de Reproduzir/Pausar */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={alternarVideo}
        className="fixed bottom-8 right-8 z-50 p-3 bg-dark-bg/40 backdrop-blur-sm border border-primary-gold/20 rounded-full hover:bg-dark-bg/60 hover:border-primary-gold/40 transition-all duration-300 group"
        aria-label={estaReproduzindo ? 'Pausar vídeo' : 'Reproduzir vídeo'}
      >
        {estaReproduzindo ? (
          <Pause className="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors" />
        ) : (
          <Play className="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors" />
        )}
      </motion.button>

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-16 w-full max-w-4xl">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-arabic font-bold text-arabic-bronze mb-6 leading-relaxed drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] px-4 overflow-visible whitespace-nowrap">
            ناصر
          </h1>
          <p className="text-3xl md:text-4xl tracking-[0.5em] text-arabic-bronze uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] font-nsr">
            Nsr
          </p>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          {itensMenu.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block text-xl md:text-2xl text-primary-white/65 hover:text-primary-gold transition-all duration-300 uppercase tracking-wider relative group"
                style={{ fontFamily: 'Nsr, sans-serif' }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-gold group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </main>
  );
}
