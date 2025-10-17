'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { products } from '@/data/products';

/**
 * Lookbook NSR - Experiência Cinematográfica
 * 
 * Design artístico com parallax, fade transitions e storytelling visual.
 * Cada scroll revela uma nova história através de composições assimétricas.
 */

interface LookSection {
  id: number;
  produto: typeof products[0];
  layout: 'left' | 'right' | 'center' | 'fullscreen';
  imageIndex: number;
}

export default function LookbookPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Criar seções do lookbook com layouts variados
  const lookSections: LookSection[] = products
    .filter(p => p.featured)
    .flatMap((produto, idx) => 
      produto.images.map((_, imageIndex) => ({
        id: idx * 100 + imageIndex,
        produto,
        layout: ['fullscreen', 'left', 'right', 'center'][idx % 4] as LookSection['layout'],
        imageIndex,
      }))
    )
    .slice(0, 8); // Limitar a 8 seções para performance

  return (
    <>
      <Header />
      
      <div ref={containerRef} className="bg-dark-bg">
        {/* Hero Fullscreen */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Vídeo/Imagem de fundo com parallax */}
        <motion.div
          style={{
            scale: useTransform(smoothProgress, [0, 0.2], [1, 1.2]),
            opacity: useTransform(smoothProgress, [0, 0.2], [1, 0]),
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-dark-bg/40 z-10" />
          <Image
            src={products[0]?.images[0] || '/images/pattern.png'}
            alt="NSR Lookbook"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Título Cinematográfico */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="relative z-20 text-center"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            <h1 className="text-[12vw] md:text-[10vw] font-arabic font-bold text-arabic-bronze mb-4 leading-none">
              ناصر
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="h-px w-32 mx-auto bg-primary-gold mb-8"
          />
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-2xl md:text-3xl tracking-[0.5em] text-primary-white/70 uppercase font-light"
          >
            Lookbook
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="text-sm text-primary-white/40 mt-8 max-w-md mx-auto px-4"
          >
            Vista sua marca, deixe sua história falar através do estilo.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <ChevronDown className="w-8 h-8 text-primary-gold/50" />
        </motion.div>
      </section>

      {/* Seções do Lookbook com Layouts Assimétricos */}
      {lookSections.map((section, index) => {
        const sectionProgress = useTransform(
          smoothProgress,
          [(index / lookSections.length), ((index + 1) / lookSections.length)],
          [0, 1]
        );
        
        const opacity = useTransform(sectionProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
        const scale = useTransform(sectionProgress, [0, 0.5, 1], [0.95, 1, 1.05]);
        const y = useTransform(sectionProgress, [0, 1], [100, -100]);

        return (
          <section
            key={section.id}
            className="relative min-h-screen flex items-center justify-center py-32 px-4 md:px-8"
          >
            {/* Layout Fullscreen */}
            {section.layout === 'fullscreen' && (
              <motion.div
                style={{ opacity, scale }}
                className="relative w-full max-w-7xl mx-auto"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={section.produto.images[section.imageIndex]}
                    alt={section.produto.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                </div>
                
                <motion.div
                  style={{ y }}
                  className="absolute bottom-12 left-12 max-w-md"
                >
                  <p className="text-xs text-primary-gold/60 mb-3 uppercase tracking-[0.3em]">
                    {section.produto.collection}
                  </p>
                  <h2 className="text-5xl md:text-6xl font-bold text-primary-white mb-4">
                    {section.produto.name}
                  </h2>
                  <Link
                    href={`/produto/${section.produto.slug}`}
                    className="inline-block mt-4 px-8 py-3 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10 transition-all duration-300 uppercase text-sm tracking-wider"
                  >
                    Ver Produto
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {/* Layout Left */}
            {section.layout === 'left' && (
              <div className="relative w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                  style={{ opacity, x: useTransform(sectionProgress, [0, 1], [-50, 50]) }}
                  className="relative aspect-[3/4]"
                >
                  <Image
                    src={section.produto.images[section.imageIndex]}
                    alt={section.produto.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
                
                <motion.div
                  style={{ opacity, y }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-xs text-primary-gold/60 mb-2 uppercase tracking-[0.3em]">
                      {section.produto.collection}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-white mb-4">
                      {section.produto.name}
                    </h2>
                    <p className="text-primary-white/60 leading-relaxed">
                      {section.produto.description}
                    </p>
                  </div>
                  
                  <Link
                    href={`/produto/${section.produto.slug}`}
                    className="inline-block px-8 py-3 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10 transition-all duration-300 uppercase text-sm tracking-wider"
                  >
                    Explorar
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Layout Right */}
            {section.layout === 'right' && (
              <div className="relative w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                  style={{ opacity, y }}
                  className="space-y-6 order-2 md:order-1"
                >
                  <div>
                    <p className="text-xs text-primary-gold/60 mb-2 uppercase tracking-[0.3em]">
                      {section.produto.collection}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-primary-white mb-4">
                      {section.produto.name}
                    </h2>
                    <p className="text-primary-white/60 leading-relaxed">
                      {section.produto.description}
                    </p>
                  </div>
                  
                  <Link
                    href={`/produto/${section.produto.slug}`}
                    className="inline-block px-8 py-3 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10 transition-all duration-300 uppercase text-sm tracking-wider"
                  >
                    Explorar
                  </Link>
                </motion.div>

                <motion.div
                  style={{ opacity, x: useTransform(sectionProgress, [0, 1], [50, -50]) }}
                  className="relative aspect-[3/4] order-1 md:order-2"
                >
                  <Image
                    src={section.produto.images[section.imageIndex]}
                    alt={section.produto.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            )}

            {/* Layout Center */}
            {section.layout === 'center' && (
              <motion.div
                style={{ opacity, scale }}
                className="relative w-full max-w-4xl mx-auto text-center"
              >
                <div className="relative aspect-[3/4] mb-12 overflow-hidden">
                  <Image
                    src={section.produto.images[section.imageIndex]}
                    alt={section.produto.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <motion.div style={{ y }}>
                  <p className="text-xs text-primary-gold/60 mb-3 uppercase tracking-[0.3em]">
                    {section.produto.collection}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-primary-white mb-6">
                    {section.produto.name}
                  </h2>
                  <p className="text-primary-white/60 mb-8 max-w-2xl mx-auto">
                    {section.produto.description}
                  </p>
                  
                  <Link
                    href={`/produto/${section.produto.slug}`}
                    className="inline-block px-8 py-3 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10 transition-all duration-300 uppercase text-sm tracking-wider"
                  >
                    Ver Detalhes
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </section>
        );
      })}

      {/* Call to Action Final */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-6xl md:text-8xl font-arabic font-bold text-arabic-bronze mb-12">
            ناصر
          </h2>
          
          <p className="text-xl text-primary-white/60 mb-12">
            Explore toda a coleção
          </p>
          
          <Link
            href="/loja"
            className="inline-block px-12 py-4 bg-primary-gold text-dark-bg hover:bg-primary-gold/90 transition-all duration-300 uppercase text-sm tracking-wider font-semibold"
          >
            Visitar Loja
          </Link>
        </motion.div>
      </section>
      </div>
      
      <Footer />
    </>
  );
}
