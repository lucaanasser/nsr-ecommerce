'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/services/product.service';

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
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
    // Bloqueia inclusão se produto estiver inativo
    if (product.isActive === false) {
      console.warn('Produto inativo, não será adicionado ao carrinho');
      return;
    }

    // Valida estoque da variante específica
    const selectedColor = color || product.variants?.[0]?.color || '';
    const variant = product.variants?.find(
      v => v.size === size && v.color === selectedColor
    );

    if (!variant || variant.stock <= 0) {
      console.warn('Variante sem estoque disponível');
      return;
    }

    setCartItems(items => {
      // Verifica se o produto com o mesmo tamanho já existe no carrinho
      const existingItem = items.find(
        item => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        
        // Valida estoque da variante antes de aumentar quantidade
        if (newQuantity > variant.stock) {
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
            selectedColor: selectedColor,
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
      items.map(item => {
        if (item.id === id && item.selectedSize === size) {
          const newQuantity = Math.max(1, item.quantity + delta);
          
          // Valida estoque da variante ao aumentar quantidade
          if (delta > 0) {
            const variant = item.variants?.find(
              v => v.size === item.selectedSize && v.color === item.selectedColor
            );
            
            if (variant && newQuantity > variant.stock) {
              console.warn('Estoque insuficiente para aumentar quantidade');
              return item; // Mantém quantidade atual
            }
          }
          
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
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
