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

    // Validar estoque da variante específica (size + color)
    const variant = item.variants?.find(
      v => v.size === item.selectedSize && v.color === item.selectedColor
    );

    if (!variant) {
      throw new Error(`Variante não encontrada para ${item.name} (${item.selectedSize}/${item.selectedColor})`);
    }

    if (variant.stock <= 0) {
      throw new Error(`Produto sem estoque: ${item.name} - ${item.selectedSize}/${item.selectedColor}`);
    }

    if (item.quantity > variant.stock) {
      throw new Error(`Estoque insuficiente para ${item.name} - ${item.selectedSize}/${item.selectedColor}. Disponível: ${variant.stock}`);
    }
  });
}
