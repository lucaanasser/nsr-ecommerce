/**
 * Configuração de imagens hospedadas no Cloudinary
 * Cloud Name: dvhvhgrvj
 */

const CLOUDINARY_CLOUD = 'dvhvhgrvj';
const CLOUDINARY_FOLDER = 'nsr';

/**
 * Helper para gerar URL de imagem do Cloudinary com otimizações
 */
const cloudinaryImage = (publicId: string, transformations = 'f_auto,q_auto') => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transformations}/${CLOUDINARY_FOLDER}/${publicId}`;
};

/**
 * URLs das imagens com otimização automática
 * f_auto = formato automático (WebP, etc.)
 * q_auto = qualidade automática baseada no dispositivo
 */
export const IMAGES = {
  // Backgrounds
  backgroundLogin: cloudinaryImage('background_login'),
  backgroundCarrinho: cloudinaryImage('background_carrinho'),
  backgroundPattern: cloudinaryImage('background_pattern'),
  
  // Patterns
  pattern1: cloudinaryImage('pattern1'),
  
  // Profile
  profile: cloudinaryImage('profile'),
  nasser: cloudinaryImage('nasser'),
  
  // Roupas - Produto 1
  roupa1Frente: cloudinaryImage('roupa1_frente'),
  roupa1Tras: cloudinaryImage('roupa1_tras'),
  
  // Roupas - Produto 2
  roupa2Frente: cloudinaryImage('roupa2_frente'),
  roupa2Tras: cloudinaryImage('roupa2_tras'),
  
  // Roupas - Produto 3
  roupa3Frente: cloudinaryImage('roupa3_frente'),
  roupa3Tras: cloudinaryImage('roupa3_tras'),
  
  // Roupas - Produto 4
  roupa4Frente: cloudinaryImage('roupa4_frente'),
  roupa4Tras: cloudinaryImage('roupa4_tras'),
} as const;

/**
 * URLs com tamanhos específicos para otimização
 */
export const getOptimizedImage = (publicId: string, width?: number, height?: number) => {
  let transformations = 'f_auto,q_auto';
  
  if (width) {
    transformations += `,w_${width}`;
  }
  if (height) {
    transformations += `,h_${height}`;
  }
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transformations}/${CLOUDINARY_FOLDER}/${publicId}`;
};

/**
 * URL direta do Cloudinary (sem otimizações)
 */
export const getDirectImage = (publicId: string) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${CLOUDINARY_FOLDER}/${publicId}`;
};
