/**
 * Componente de Resumo do Pedido (sidebar)
 * Exibe os itens do carrinho, subtotal, frete e total
 */

import Image from 'next/image';
import type { CartItem } from '@/context/CartContext';

interface CheckoutSummaryProps {
  itens: CartItem[];
  subtotal: number;
  frete: number;
  total: number;
}

export default function CheckoutSummary({ 
  itens, 
  subtotal, 
  frete, 
  total 
}: CheckoutSummaryProps) {
  return (
    <div className="bg-dark-card border border-dark-border p-6 rounded-sm sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

      {/* Lista de produtos */}
      <div className="space-y-4 mb-6">
        {itens.map((item) => (
          <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
            <div className="relative w-16 h-20 flex-shrink-0">
              <Image
                src={item.images?.[0]?.url || '/images/placeholder.jpg'}
                alt={item.name}
                fill
                className="object-cover rounded-sm"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-primary-white/50">
                Tamanho: {item.selectedSize} | Cor: {item.selectedColor}
              </p>
              <p className="text-xs text-primary-white/50">Qtd: {item.quantity}</p>
              <p className="text-sm text-primary-gold mt-1">
                R$ {(Number(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totais */}
      <div className="border-t border-dark-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-primary-white/70">Subtotal</span>
          <span>R$ {Number(subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-primary-white/70">Frete</span>
          <span className={frete === 0 ? 'text-green-500' : ''}>
            {frete === 0 ? 'Grátis' : `R$ ${Number(frete).toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-3 border-t border-dark-border">
          <span>Total</span>
          <span className="text-primary-bronze">R$ {Number(total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
