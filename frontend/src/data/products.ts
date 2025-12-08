import { IMAGES } from '@/config/images';

// Tipos TypeScript para os dados mockados
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'masculino' | 'feminino';
  collection: string;
  sizes: string[];
  unavailableSizes?: string[]; // Tamanhos indisponíveis
  colors: string[];
  images: string[];
  featured: boolean;
  new: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

// Dados mockados de produtos
export const products: Product[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Oversized Tee Geometric',
    slug: 'oversized-tee-geometric',
    description: 'Camiseta oversized com estampa geométrica inspirada em padrões árabes tradicionais. Confeccionada em algodão premium, oferece conforto e estilo único.',
    price: 189.90,
    category: 'masculino',
    collection: 'Desert Dreams',
    sizes: ['P', 'M', 'G', 'GG'],
    unavailableSizes: ['GG'], // Exemplo: GG indisponível
    colors: ['Preto', 'Bege', 'Branco'],
    images: [
      IMAGES.roupa1Frente,
      IMAGES.roupa1Tras,
    ],
    featured: true,
    new: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Calça Cargo Urban',
    slug: 'calca-cargo-urban',
    description: 'Calça cargo com múltiplos bolsos e ajuste moderno. Design funcional com acabamento premium e detalhes em metal escovado.',
    price: 299.90,
    category: 'masculino',
    collection: 'Urban Nomad',
    sizes: ['38', '40', '42', '44'],
    colors: ['Preto', 'Verde Oliva', 'Bege'],
    images: [
      IMAGES.roupa2Frente,
      IMAGES.roupa2Tras,
    ],
    featured: true,
    new: false,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Moletom Medina',
    slug: 'moletom-medina',
    description: 'Moletom premium com capuz e bordado sutil em dourado. Corte moderno que valoriza a silhueta com máximo conforto.',
    price: 349.90,
    category: 'masculino',
    collection: 'Desert Dreams',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Cinza', 'Bege'],
    images: [
      IMAGES.roupa3Frente,
      IMAGES.roupa3Tras,
    ],
    featured: false,
    new: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Crop Top Arabesque',
    slug: 'crop-top-arabesque',
    description: 'Crop top feminino com estampa arabesque minimalista. Tecido leve e respirável, perfeito para compor looks modernos.',
    price: 159.90,
    category: 'feminino',
    collection: 'Sahara Soul',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: ['Preto', 'Branco', 'Dourado'],
    images: [
      IMAGES.roupa4Frente,
      IMAGES.roupa4Tras,
    ],
    featured: true,
    new: true,
  },
];

// Coleções
export const collections = [
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Desert Dreams',
    description: 'Inspirada nas dunas e no pôr do sol do deserto',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Urban Nomad',
    description: 'O encontro entre tradição e modernidade urbana',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Sahara Soul',
    description: 'Alma livre, estilo atemporal',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
  },
];
