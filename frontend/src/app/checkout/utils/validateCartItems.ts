import type { CartItem } from '@/context/CartContext';

export function validateCartItemsForCheckout(items: CartItem[]) {
  if (!items.length) {
    throw new Error('Carrinho vazio');
  }

  items.forEach((item) => {
    if (!item.id) {
      throw new Error('Produto inválido no carrinho (ID ausente)');
    }
    if (!item.quantity || item.quantity <= 0) {
      throw new Error('Quantidade inválida para um dos itens do carrinho');
    }
    if (!item.selectedSize) {
      throw new Error('Selecione um tamanho para todos os itens');
    }
    const knownStock = (item as any).stock;
    if (typeof knownStock === 'number') {
      if (knownStock <= 0) {
        throw new Error(`Produto sem estoque: ${item.name}`);
      }
      if (item.quantity > knownStock) {
        throw new Error(`Quantidade acima do estoque para ${item.name}`);
      }
    }
  });
}
