'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';
import ShoppingBasketIcon from '@/components/icons/ShoppingBasketIcon';
import UserIcon from '@/components/icons/UserIcon';

/**
 * Componente Header
 * 
 * Cabeçalho fixo com navegação principal, logo NSR estilizado
 * e ícones de ações (busca, carrinho, perfil).
 */
export default function Header({ hideLogo = false }: { hideLogo?: boolean }) {
  const { isAuthenticated } = useAuthContext();
  const [menuEstaAberto, setMenuEstaAberto] = useState(false);
  const [lojaEstaAberta, setLojaEstaAberta] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const referenciaLoja = useRef<HTMLDivElement>(null);
  const referenciaBusca = useRef<HTMLInputElement>(null);
  const { obterContagemCarrinho } = useCart();
  const caminhoAtual = usePathname();
  const roteador = useRouter();

  // Verifica se estamos na página da loja
  const estaNaPaginaDaLoja = caminhoAtual === '/loja';

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const manipularCliqueFora = (event: MouseEvent) => {
      if (referenciaLoja.current && !referenciaLoja.current.contains(event.target as Node)) {
        setLojaEstaAberta(false);
      }
    };

    if (lojaEstaAberta) {
      document.addEventListener('mousedown', manipularCliqueFora);
    }

    return () => {
      document.removeEventListener('mousedown', manipularCliqueFora);
    };
  }, [lojaEstaAberta]);

  // Foca no input quando a busca abre
  useEffect(() => {
    if (buscaAberta && referenciaBusca.current) {
      referenciaBusca.current.focus();
    }
  }, [buscaAberta]);

  const categoriasLoja = [
    { label: 'All', href: '/loja' },
    { label: 'Masculino', href: '/loja?filter=masculino' },
    { label: 'Feminino', href: '/loja?filter=feminino' },
    { label: 'Camisetas', href: '/loja?category=camisetas' },
    { label: 'Calças', href: '/loja?category=calcas' },
    { label: 'Moletons', href: '/loja?category=moletons' },
    { label: 'Acessórios', href: '/loja?category=acessorios' },
  ];

  const itensMenu = [
    { label: 'Lookbook', href: '/lookbook' },
    { label: 'Sobre', href: '/sobre' },
  ];

  // Handler para o botão Shop
  const manipularCliqueShop = () => {
    if (estaNaPaginaDaLoja) {
      // Se já estamos na página da loja, abre/fecha o dropdown
      setLojaEstaAberta(!lojaEstaAberta);
    } else {
      // Se não estamos na página da loja, redireciona para /loja
      roteador.push('/loja');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-black backdrop-blur-sm border-b border-dark-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo NSR */}
          {!hideLogo && (
            <Link href="/" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-5xl font-arabic font-bold text-arabic-bronze">
                  ناصر
                </h1>
              </motion.div>
            </Link>
          )}
          {hideLogo && <div />} {/* Spacer quando o logo está oculto */}

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Shop com Dropdown */}
            <div 
              ref={referenciaLoja}
              className="relative"
            >
              <button 
                onClick={manipularCliqueShop}
                className="text-2xl font-nsr uppercase tracking-wider text-primary-white/70 hover:text-primary-gold transition-colors duration-300 flex items-center gap-1"
              >
                Shop
                {estaNaPaginaDaLoja && (
                  <ChevronDown size={18} className={`transition-transform duration-300 ${lojaEstaAberta ? 'rotate-180' : ''}`} />
                )}
              </button>
              
              {/* Dropdown */}
              <AnimatePresence>
                {lojaEstaAberta && estaNaPaginaDaLoja && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-dark-card/95 backdrop-blur-sm border border-dark-border rounded-sm shadow-xl py-2"
                  >
                    {categoriasLoja.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        onClick={() => setLojaEstaAberta(false)}
                        className="block px-4 py-2 text-lg font-nsr text-primary-white/70 hover:text-primary-gold hover:bg-dark-bg/50 transition-colors uppercase tracking-wider"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Outros itens do menu */}
            {itensMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-2xl font-nsr uppercase tracking-wider text-primary-white/70 hover:text-primary-gold transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Ações */}
          <div className="flex items-center space-x-6">
            {/* Busca */}
            <div className="relative">
              <button
                onClick={() => setBuscaAberta(!buscaAberta)}
                className="p-2 text-arabic-bronze hover:text-arabic-bronze/80 transition-colors"
                aria-label="Buscar"
              >
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                  <Search size={20} strokeWidth={2.5} />
                </motion.div>
              </button>

              {/* Campo de busca */}
              <AnimatePresence>
                {buscaAberta && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80"
                  >
                    <div className="bg-dark-card/95 backdrop-blur-sm border border-dark-border rounded-sm shadow-xl p-4">
                      <div className="relative">
                        <input
                          ref={referenciaBusca}
                          type="text"
                          placeholder="Buscar produtos..."
                          className="w-full bg-dark-bg/50 border border-dark-border px-4 py-2 pr-10 text-primary-white placeholder:text-primary-white/40 focus:outline-none focus:border-primary-gold transition-colors rounded-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setBuscaAberta(false);
                            }
                          }}
                        />
                        <Search 
                          size={18} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-white/40 pointer-events-none" 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              href={isAuthenticated ? "/perfil" : "/login"}
              className="hidden lg:block p-2 text-arabic-bronze hover:text-arabic-bronze/80 transition-colors"
              aria-label="Perfil"
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <UserIcon size={20} />
              </motion.div>
            </Link>
            <Link
              href="/carrinho"
              className="p-2 text-arabic-bronze hover:text-arabic-bronze/80 transition-colors relative"
              aria-label="Carrinho"
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <ShoppingBasketIcon size={20} />
              </motion.div>
              {obterContagemCarrinho() > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary-gold text-primary-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {obterContagemCarrinho()}
                </motion.span>
              )}
            </Link>

            {/* Menu Mobile Toggle */}
            <button
              className="lg:hidden p-2 hover:text-primary-gold transition-colors"
              onClick={() => setMenuEstaAberto(!menuEstaAberto)}
              aria-label="Menu"
            >
              {menuEstaAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {menuEstaAberto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark-card border-t border-dark-border"
          >
            <nav className="container-custom py-6 space-y-4">
              {/* Shop com subcategorias no mobile */}
              <div>
                <button
                  onClick={manipularCliqueShop}
                  className="w-full flex items-center justify-between text-2xl font-nsr uppercase tracking-wider text-primary-white/70 hover:text-arabic-bronze transition-colors duration-300 py-2"
                >
                  Shop
                  {estaNaPaginaDaLoja && (
                    <ChevronDown size={20} className={`transition-transform duration-300 ${lojaEstaAberta ? 'rotate-180' : ''}`} />
                  )}
                </button>
                <AnimatePresence>
                  {lojaEstaAberta && estaNaPaginaDaLoja && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 pt-2 space-y-2"
                    >
                      {categoriasLoja.map((category) => (
                        <Link
                          key={category.href}
                          href={category.href}
                          className="block text-lg font-nsr uppercase tracking-wider text-primary-white/60 hover:text-arabic-bronze transition-colors py-1"
                          onClick={() => setMenuEstaAberto(false)}
                        >
                          {category.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Outros itens */}
              {itensMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-2xl font-nsr uppercase tracking-wider text-primary-white/70 hover:text-arabic-bronze transition-colors duration-300 py-2"
                  onClick={() => setMenuEstaAberto(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
