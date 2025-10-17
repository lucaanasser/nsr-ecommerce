/**
 * Configuração de vídeos hospedados no Cloudinary
 * Cloud Name: dvhvhgrvj
 */

const CLOUDINARY_CLOUD = 'dvhvhgrvj';

/**
 * URLs dos vídeos com otimização automática
 * q_auto = qualidade automática baseada no dispositivo
 * f_auto = formato automático (WebM, MP4, etc.)
 * w_1920 = largura máxima de 1920px (full HD)
 * c_limit = limita o tamanho mantendo proporção
 */
export const VIDEOS = {
  // Vídeo otimizado para web (menor tamanho, carrega mais rápido)
  landpage: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/q_auto:low,f_auto,w_1920,c_limit/nsr/video_landpage`,
  
  // Vídeo da página Sobre
  sobre: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/q_auto:low,f_auto,w_1920,c_limit/nsr/video_sobre`,
  
  // Vídeo da página Legal
  legal: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/q_auto:low,f_auto,w_1920,c_limit/nsr/video_legal`,
} as const;

/**
 * Thumbnails (posters) dos vídeos
 * so_0 = segundo 0 do vídeo (primeiro frame)
 * q_auto = qualidade automática
 * w_1920 = largura máxima
 */
export const VIDEO_POSTERS = {
  landpage: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_0,q_auto,w_1920/nsr/video_landpage.jpg`,
  sobre: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_0,q_auto,w_1920/nsr/video_sobre.jpg`,
  legal: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_0,q_auto,w_1920/nsr/video_legal.jpg`,
} as const;

/**
 * URLs diretas sem otimização (fallback se necessário)
 */
export const VIDEOS_DIRECT = {
  landpage: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/nsr/video_landpage.webm`,
  sobre: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/nsr/video_sobre.webm`,
  legal: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/nsr/video_legal.webm`,
} as const;
