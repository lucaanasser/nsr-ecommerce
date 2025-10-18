'use client';

import Link from 'next/link';
import { Instagram, MessageCircle, Youtube } from 'lucide-react';

/**
 * Componente Footer
 * 
 * Rodapé minimalista com marca, newsletter e links de suporte
 */
export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-6">
          {/* Marca */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-2 flex flex-col items-center lg:items-start gap-0">
              <h2 className="text-3xl font-arabic font-bold text-arabic-bronze" style={{ padding: 0, lineHeight: 1, marginBottom: '0.25rem' }}>
                ناصر
              </h2>
              <p className="text-base tracking-[0.3em] text-arabic-bronze uppercase lg:self-start" style={{ fontFamily: 'Nsr, sans-serif', padding: 0, lineHeight: 1 }}>
                Nsr
              </p>
            </div>
            <p className="text-base text-primary-white/60 leading-relaxed max-w-xs" style={{ fontFamily: 'Nsr, sans-serif' }}>
              Streetwear árabe contemporâneo. Onde tradição encontra modernidade.
            </p>
          </div>

          {/* Redes Sociais - Destaque central */}
          <div className="flex justify-center space-x-8">
            <a
              href="#"
              className="text-primary-gold/60 hover:text-primary-gold transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a
              href="#"
              className="text-primary-gold/60 hover:text-primary-gold transition-all duration-300 hover:scale-110"
              aria-label="WhatsApp"
            >
              <MessageCircle size={24} />
            </a>
            <a
              href="#"
              className="text-primary-gold/60 hover:text-primary-gold transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
            >
              <Youtube size={24} />
            </a>
          </div>

          {/* Newsletter - Compacta */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="w-full max-w-xs">
              <h3 className="text-base uppercase tracking-wider mb-2 text-primary-gold text-center lg:text-right" style={{ fontFamily: 'Nsr, sans-serif' }}>
                Newsletter
              </h3>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 bg-dark-bg border border-dark-border px-3 py-2 text-xs focus:outline-none focus:border-primary-gold transition-colors"
                  
                />
                <button className="bg-primary-gold text-primary-black px-4 py-2 text-base uppercase tracking-wider hover:bg-primary-bronze transition-all duration-300" style={{ fontFamily: 'Nsr, sans-serif' }}>
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Suporte Horizontal e Copyright - Compacto */}
        <div className="border-t border-dark-border pt-4 space-y-3">
          {/* Links de Suporte - Horizontal */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
            <div className="flex items-center">
              <Link
                href="/faq"
                className="text-base text-primary-white/50 hover:text-primary-gold transition-colors uppercase tracking-wider"
                style={{ fontFamily: 'Nsr, sans-serif' }}
              >
                FAQ
              </Link>
              <span className="ml-3 md:ml-6 text-primary-white/20">•</span>
            </div>
            <div className="flex items-center">
              <Link
                href="/envios"
                className="text-base text-primary-white/50 hover:text-primary-gold transition-colors uppercase tracking-wider"
                style={{ fontFamily: 'Nsr, sans-serif' }}
              >
                Envios
              </Link>
              <span className="ml-3 md:ml-6 text-primary-white/20">•</span>
            </div>
            <div className="flex items-center">
              <Link
                href="/trocas"
                className="text-base text-primary-white/50 hover:text-primary-gold transition-colors uppercase tracking-wider"
                style={{ fontFamily: 'Nsr, sans-serif' }}
              >
                Trocas
              </Link>
              <span className="ml-3 md:ml-6 text-primary-white/20">•</span>
            </div>
            <div className="flex items-center">
              <Link
                href="/politica-privacidade"
                className="text-base text-primary-white/50 hover:text-primary-gold transition-colors uppercase tracking-wider"
                style={{ fontFamily: 'Nsr, sans-serif' }}
              >
                Privacidade
              </Link>
              <span className="ml-3 md:ml-6 text-primary-white/20">•</span>
            </div>
            <div className="flex items-center">
              <Link
                href="/termos-uso"
                className="text-base text-primary-white/50 hover:text-primary-gold transition-colors uppercase tracking-wider"
                style={{ fontFamily: 'Nsr, sans-serif' }}
              >
                Termos
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-xs text-primary-white/40 text-center" >
            © 2025 NSR. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
