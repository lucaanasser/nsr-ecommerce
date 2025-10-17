'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { collections } from '@/data/products';

/**
 * Página Lookbook
 * 
 * Página de lookbook com imagens grandes das coleções
 */
export default function LookbookPage() {
  return (
    <>
      <Header />
      
      <main className="pt-32 pb-20 min-h-screen">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24 text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient">
              Lookbook
            </h1>
            <p className="text-primary-white/50 text-lg">
              Explore nossas coleções visuais
            </p>
          </motion.div>

          {/* Imagens grandes das coleções */}
          <div className="space-y-32">
            {collections.map((colecao, indice) => (
              <motion.div
                key={colecao.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: indice * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Imagem fullwidth */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
                  <Image
                    src={colecao.image}
                    alt={colecao.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                </div>
                
                {/* Info da coleção */}
                <div className="mt-8 text-center">
                  <h2 className="text-4xl font-bold mb-3 text-gradient">
                    {colecao.name}
                  </h2>
                  <p className="text-primary-white/60 text-lg">
                    {colecao.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
