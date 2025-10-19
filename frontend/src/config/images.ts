/**
 * Configuração de imagens hospedadas no Cloudinary
 * Cloud Name: dvhvhgrvj
 */


// Cloudinary profissional
const CLOUDINARY_CLOUD = 'dcdbwwvtk';

// Helpers para cada grupo de imagens
const cloudinaryImageBG = (publicId: string, transformations = 'f_auto,q_auto') =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transformations}/images_nsr_ecommerce/images_backgroud/${publicId}`;

const cloudinaryImageMock = (publicId: string, transformations = 'f_auto,q_auto') =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transformations}/images_nsr_ecommerce/mock_clothes/${publicId}`;

/**
 * URLs das imagens com otimização automática
 * f_auto = formato automático (WebP, etc.)
 * q_auto = qualidade automática baseada no dispositivo
 */
export const IMAGES = {
  // Backgrounds
  backgroundLogin: cloudinaryImageBG('background_login.png'),
  backgroundCarrinho: cloudinaryImageBG('background_carrinho.png'),
  backgroundPattern: cloudinaryImageBG('background_pattern.png'),

  // Patterns
  pattern1: cloudinaryImageBG('pattern1.png'),

  // Profile
  profile: cloudinaryImageBG('profile.png'),
  nasser: cloudinaryImageBG('nasser.jpg'),

  // Roupas - Produto 1
  roupa1Frente: cloudinaryImageMock('roupa1_frente.png'),
  roupa1Tras: cloudinaryImageMock('roupa1_tras.png'),

  // Roupas - Produto 2
  roupa2Frente: cloudinaryImageMock('roupa2_frente.png'),
  roupa2Tras: cloudinaryImageMock('roupa2_tras.png'),

  // Roupas - Produto 3
  roupa3Frente: cloudinaryImageMock('roupa3_frente.png'),
  roupa3Tras: cloudinaryImageMock('roupa3_tras.png'),

  // Roupas - Produto 4
  roupa4Frente: cloudinaryImageMock('roupa4_frente.png'),
  roupa4Tras: cloudinaryImageMock('roupa4_tras.png'),
} as const;

/**
 * URLs com tamanhos específicos para otimização
 */
// Helpers para imagens otimizadas
export const getOptimizedImageBG = (publicId: string, width?: number, height?: number) => {
  let transformations = 'f_auto,q_auto';
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transformations}/images_nsr_ecommerce/images_backgroud/${publicId}`;
};
export const getOptimizedImageMock = (publicId: string, width?: number, height?: number) => {
  let transformations = 'f_auto,q_auto';
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transformations}/images_nsr_ecommerce/mock_clothes/${publicId}`;
};

/**
 * URL direta do Cloudinary (sem otimizações)
 */
export const getDirectImageBG = (publicId: string) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/images_nsr_ecommerce/images_backgroud/${publicId}`;
};
export const getDirectImageMock = (publicId: string) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/images_nsr_ecommerce/mock_clothes/${publicId}`;
};
