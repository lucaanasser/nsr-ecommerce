import { validateCartItemsForCheckout } from '@/app/checkout/utils/validateCartItems';

const validItem = {
  id: 'p1',
  name: 'Produto 1',
  slug: 'produto-1',
  description: 'desc',
  price: 100,
  comparePrice: null,
  stock: 10,
  sku: 'SKU-001',
  category: 'masculino' as const,
  gender: 'UNISEX' as const,
  collection: null,
  images: [],
  isFeatured: false,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  variants: [
    {
      id: 'v1',
      size: 'M',
      color: 'Preto',
      stock: 2,
      sku: 'SKU-001-M-PRETO',
      price: null,
      comparePrice: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  quantity: 1,
  selectedSize: 'M',
  selectedColor: 'Preto',
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

// Should fail when variant stock is zero
expectThrow(() =>
  validateCartItemsForCheckout([{ 
    ...validItem, 
    variants: [{ 
      id: 'v1', 
      size: 'M', 
      color: 'Preto', 
      stock: 0, 
      sku: 'SKU-001-M-PRETO',
      price: null,
      comparePrice: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]
  }]),
  'sem estoque'
);

// Should fail when quantity exceeds variant stock
expectThrow(() =>
  validateCartItemsForCheckout([{ 
    ...validItem, 
    quantity: 3,
    variants: [{ 
      id: 'v1', 
      size: 'M', 
      color: 'Preto', 
      stock: 2, 
      sku: 'SKU-001-M-PRETO',
      price: null,
      comparePrice: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]
  }]),
  'acima do estoque'
);

console.log('Frontend smoke test passed');
