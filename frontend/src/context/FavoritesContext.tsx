'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/data/products';

interface FavoritesContextType {
  favoritos: Product[];
  adicionarAosFavoritos: (product: Product) => void;
  removerDosFavoritos: (productId: string) => void;
  estaNosFavoritos: (productId: string) => boolean;
  obterContagemFavoritos: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<Product[]>([]);

  // Carrega favoritos do localStorage ao iniciar
  useEffect(() => {
    const favoritosSalvos = localStorage.getItem('favoritos');
    if (favoritosSalvos) {
      setFavoritos(JSON.parse(favoritosSalvos));
    }
  }, []);

  // Salva favoritos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const adicionarAosFavoritos = (product: Product) => {
    setFavoritos(prev => {
      // Verifica se já existe
      const jaExiste = prev.some(item => item.id === product.id);
      if (jaExiste) {
        // Se já existe, remove (toggle)
        return prev.filter(item => item.id !== product.id);
      } else {
        // Se não existe, adiciona
        return [...prev, product];
      }
    });
  };

  const removerDosFavoritos = (productId: string) => {
    setFavoritos(prev => prev.filter(item => item.id !== productId));
  };

  const estaNosFavoritos = (productId: string) => {
    return favoritos.some(item => item.id === productId);
  };

  const obterContagemFavoritos = () => {
    return favoritos.length;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoritos,
        adicionarAosFavoritos,
        removerDosFavoritos,
        estaNosFavoritos,
        obterContagemFavoritos,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
