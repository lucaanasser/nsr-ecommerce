/**
 * Tipos e constantes para o sistema de variantes de produtos
 */

// ================================
// TIPOS DE TAMANHO
// ================================

export type SizeType = 'standard' | 'numeric' | 'custom' | 'unique';

export interface SizeOption {
  value: string;
  label: string;
  order: number;
}

export const SIZE_PRESETS: Record<SizeType, SizeOption[]> = {
  standard: [
    { value: 'pp', label: 'PP', order: 0 },
    { value: 'p', label: 'P', order: 1 },
    { value: 'm', label: 'M', order: 2 },
    { value: 'g', label: 'G', order: 3 },
    { value: 'gg', label: 'GG', order: 4 },
    { value: 'xgg', label: 'XGG', order: 5 },
    { value: 'exgg', label: 'EXGG', order: 6 },
  ],
  numeric: [
    { value: '34', label: '34', order: 0 },
    { value: '36', label: '36', order: 1 },
    { value: '38', label: '38', order: 2 },
    { value: '40', label: '40', order: 3 },
    { value: '42', label: '42', order: 4 },
    { value: '44', label: '44', order: 5 },
    { value: '46', label: '46', order: 6 },
    { value: '48', label: '48', order: 7 },
    { value: '50', label: '50', order: 8 },
    { value: '52', label: '52', order: 9 },
  ],
  custom: [], // Usuário define
  unique: [{ value: 'unico', label: 'Tamanho Único', order: 0 }],
};

// ================================
// CORES
// ================================

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  isPredefined: boolean;
}

export const PREDEFINED_COLORS: ColorOption[] = [
  { id: 'preto', name: 'Preto', hex: '#000000', isPredefined: true },
  { id: 'branco', name: 'Branco', hex: '#FFFFFF', isPredefined: true },
  { id: 'bege', name: 'Bege', hex: '#F5F5DC', isPredefined: true },
  { id: 'cinza', name: 'Cinza', hex: '#808080', isPredefined: true },
  { id: 'azul', name: 'Azul', hex: '#4169E1', isPredefined: true },
  { id: 'verde', name: 'Verde', hex: '#228B22', isPredefined: true },
  { id: 'vermelho', name: 'Vermelho', hex: '#DC143C', isPredefined: true },
  { id: 'rosa', name: 'Rosa', hex: '#FF69B4', isPredefined: true },
  { id: 'roxo', name: 'Roxo', hex: '#8B008B', isPredefined: true },
  { id: 'amarelo', name: 'Amarelo', hex: '#FFD700', isPredefined: true },
];

// ================================
// VARIANTES
// ================================

export interface ProductVariant {
  id: string; // UUID gerado no frontend
  size: string; // 'p', 'm', '38', 'unico', etc.
  sizeLabel: string; // 'P', 'M', '38', 'Tamanho Único'
  color?: string; // 'preto', 'azul', 'custom-1'
  colorName?: string; // 'Preto', 'Azul', 'Verde Oliva'
  colorHex?: string; // '#000000', '#0000FF', '#556B2F'
  stock: number; // Quantidade em estoque
  sku?: string; // Gerado automaticamente ou customizado
  priceAdjustment?: number; // Ajuste de preço (+/- em relação ao preço base)
  isActive: boolean; // Variante ativa/inativa
}

export interface VariantConfig {
  // Configuração de tamanhos
  sizeType: SizeType;
  sizes: SizeOption[]; // Tamanhos selecionados
  
  // Configuração de cores
  hasColors: boolean; // Se cores estão ativadas
  colors: ColorOption[]; // Cores selecionadas
  
  // Variantes geradas
  variants: ProductVariant[];
}

// ================================
// VALORES INICIAIS
// ================================

export const INITIAL_VARIANT_CONFIG: VariantConfig = {
  sizeType: 'standard',
  sizes: [],
  hasColors: false,
  colors: [],
  variants: [],
};

// ================================
// HELPERS
// ================================

/**
 * Gera SKU para uma variante
 */
export function generateVariantSku(
  baseSku: string,
  size: string,
  color?: string
): string {
  if (!baseSku) return '';
  let sku = baseSku.toUpperCase();
  if (size) sku += `-${size.toUpperCase()}`;
  if (color) sku += `-${color.toUpperCase()}`;
  return sku;
}

/**
 * Retorna a cor do status do estoque
 */
export function getStockStatusColor(stock: number): string {
  if (stock === 0) return 'text-red-500';
  if (stock <= 5) return 'text-yellow-500';
  return 'text-green-500';
}

/**
 * Retorna o background do status do estoque
 */
export function getStockStatusBg(stock: number): string {
  if (stock === 0) return 'bg-red-500/10 border-red-500/30';
  if (stock <= 5) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-green-500/10 border-green-500/30';
}

/**
 * Retorna o label do status do estoque
 */
export function getStockStatusLabel(stock: number): string {
  if (stock === 0) return 'Esgotado';
  if (stock <= 5) return 'Estoque Baixo';
  return 'Disponível';
}
