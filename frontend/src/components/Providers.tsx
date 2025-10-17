'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AdminProvider } from '@/context/AdminContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </CartProvider>
    </AdminProvider>
  );
}
