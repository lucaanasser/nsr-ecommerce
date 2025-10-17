'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { VIDEOS, VIDEO_POSTERS } from '@/config/videos';

/**
 * Página Sobre
 * 
 * Página sobre a marca NSR
 */
export default function SobrePage() {
  const [estaReproduzindo, setEstaReproduzindo] = useState(true);
  const referenciaVideo = useRef<HTMLVideoElement>(null);

  const alternarReproducao = () => {
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
    <>
      <Header hideLogo={true} />
      
      <main className="pt-20 pb-0">
        <div className="flex flex-col lg:flex-row">
          {/* Coluna de Vídeo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative lg:w-[40%] h-[600px] lg:h-auto lg:min-h-screen"
          >
            <video
              ref={referenciaVideo}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              preload="auto"
              poster={VIDEO_POSTERS.sobre}
              className="w-full h-full object-cover"
              style={{
                filter: 'brightness(0.7) contrast(1.2) saturate(0.8) sepia(0.2)',
              }}
              src={VIDEOS.sobre}
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
            
            {/* Overlay escuro para dar um toque vintage */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-black/30" />
            <div className="absolute inset-0 bg-amber-900/10" />
            
            {/* Botão Play/Pause Minimalista */}
            <button
              onClick={alternarReproducao}
              className="absolute top-6 left-6 z-10
                         text-primary-gold transition-all duration-300
                         hover:scale-110 hover:opacity-80 focus:outline-none"
              aria-label={estaReproduzindo ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            >
              {estaReproduzindo ? (
                // Ícone de Pause
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 drop-shadow-lg" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                // Ícone de Play
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 drop-shadow-lg" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </motion.div>

          {/* Coluna de Texto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-start justify-center px-12 lg:px-20 pt-24 pb-12 lg:w-[60%] min-h-screen"
          >
            <div className="max-w-4xl w-full">
              <Link href="/" className="block group">
                <motion.h1 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="text-9xl font-arabic font-bold text-arabic-bronze mb-4 text-center cursor-pointer"
                >
                  ناصر
                </motion.h1>
              </Link>
              <h2 className="text-4xl font-nsr font-bold mb-16 text-center">Nsr</h2>
              
              <div className="space-y-6 text-xl text-primary-white/80 leading-relaxed">
                <p className="text-left">
                  A ideia nasceu quando tínhamos 14 anos. Dois primos, a mesma vontade: 
                  criar um espaço nosso, uma marca onde pudéssemos transformar nossa arte 
                  em peças para vestir nossos parceiros.
                </p>
                
                <p className="text-left">
                  A <strong className="text-primary-gold">NSR</strong> vem daí, das nossas raízes 
                  e das ruas que nos criaram. Nosso DNA carrega a energia das ruas, as cores do graffiti 
                  e a atitude do pixo. O nome vem de <strong className="text-primary-gold">NASSER</strong>, 
                  o sobrenome árabe que nos une e conecta nossa herança ao concreto da cidade.
                </p>
                
                <p className="text-left">
                  Para nós, cada peça é uma tela e cada estampa é um pedaço da nossa história. 
                  É a expressão mais autêntica das ruas transformada em streetwear com propósito, 
                  identidade e a nossa verdade.
                </p>
                
                <div className="pt-8 border-t border-primary-gold/20 mt-12">
                  <p className="text-primary-gold italic text-2xl font-bold text-center tracking-wide">
                    "Vista Sua Marca. Deixe Sua Marca"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
