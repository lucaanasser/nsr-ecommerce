'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  stock?: number;
  isActive?: boolean;
}

interface CartContextType {
  itensCarrinho: CartItem[];
  adicionarAoCarrinho: (product: Product, size: string, color?: string) => void;
  removerDoCarrinho: (id: string, size: string) => void;
  atualizarQuantidade: (id: string, size: string, delta: number) => void;
  limparCarrinho: () => void;
  obterTotalCarrinho: () => number;
  obterContagemCarrinho: () => number;
  // Manter nomes em inglês para compatibilidade
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, color?: string) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size: string, color?: string) => {
    // Bloqueia inclusão se produto estiver inativo ou sem estoque conhecido
    if ((product as any).isActive === false) {
      console.warn('Produto inativo, não será adicionado ao carrinho');
      return;
    }
    if (typeof (product as any).stock === 'number' && (product as any).stock <= 0) {
      console.warn('Produto sem estoque, não será adicionado ao carrinho');
      return;
    }

    setCartItems(items => {
      // Verifica se o produto com o mesmo tamanho já existe no carrinho
      const existingItem = items.find(
        item => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        const stockLimit = (existingItem as any).stock;
        if (typeof stockLimit === 'number' && newQuantity > stockLimit) {
          console.warn('Estoque insuficiente para aumentar quantidade no carrinho');
          return items;
        }
        // Se existir, aumenta a quantidade
        return items.map(item =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Se não existir, adiciona novo item
        return [
          ...items,
          {
            ...product,
            quantity: 1,
            selectedSize: size,
            selectedColor: color || product.colors[0],
          },
        ];
      }
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems(items =>
      items.filter(item => !(item.id === id && item.selectedSize === size))
    );
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        // Nomes em PT-BR
        itensCarrinho: cartItems,
        adicionarAoCarrinho: addToCart,
        removerDoCarrinho: removeFromCart,
        atualizarQuantidade: updateQuantity,
        limparCarrinho: clearCart,
        obterTotalCarrinho: getCartTotal,
        obterContagemCarrinho: getCartCount,
        // Nomes originais em inglês para compatibilidade
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
