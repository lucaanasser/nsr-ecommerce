import { validateCartItemsForCheckout } from '@/app/checkout/utils/validateCartItems';

const validItem = {
  id: 'p1',
  name: 'Produto 1',
  slug: 'produto-1',
  description: 'desc',
  price: 100,
  category: 'masculino' as const,
  collection: 'c1',
  sizes: ['M'],
  colors: ['Preto'],
  images: [],
  featured: false,
  new: false,
  quantity: 1,
  selectedSize: 'M',
  selectedColor: 'Preto',
  stock: 2,
  isActive: true,
};

function expectThrow(fn: () => void, messageSubstring: string) {
  try {
    fn();
  } catch (err: any) {
    if (!err?.message?.includes(messageSubstring)) {
      console.error('Unexpected error message', err?.message);
      process.exit(1);
    }
    return;
  }
  console.error('Expected function to throw');
  process.exit(1);
}

// Should pass
validateCartItemsForCheckout([validItem]);

// Should fail when ID missing
expectThrow(() =>
  validateCartItemsForCheckout([{ ...validItem, id: '' } as any]),
  'ID ausente'
);

// Should fail when quantity invalid
expectThrow(() =>
  validateCartItemsForCheckout([{ ...validItem, quantity: 0 }]),
  'Quantidade inválida'
);

// Should fail when size missing
expectThrow(() =>
  validateCartItemsForCheckout([{ ...validItem, selectedSize: '' }]),
  'Selecione um tamanho'
);

// Should fail when stock known and zero
expectThrow(() =>
  validateCartItemsForCheckout([{ ...validItem, stock: 0 }]),
  'sem estoque'
);

// Should fail when quantity exceeds stock
expectThrow(() =>
  validateCartItemsForCheckout([{ ...validItem, quantity: 3, stock: 2 }]),
  'acima do estoque'
);

console.log('Frontend smoke test passed');
