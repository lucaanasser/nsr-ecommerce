/**
 * Service responsável por upload, deleção e gerenciamento de imagens no Cloudinary.
 * Centraliza integração com o serviço externo de armazenamento de imagens.
 */
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env';
import { InternalServerError } from '../utils/errors';
import { logger } from '@config/logger.colored';

/**
 * Cloudinary Service
 * Gerencia upload e deleção de imagens no Cloudinary
 */
class CloudinaryService {
  constructor() {
    // Configurar SDK do Cloudinary
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });

    logger.info('Cloudinary configurado com sucesso');
  }

  /**
   * Upload de uma única imagem
   * @param file - Arquivo Multer
   * @returns URL segura da imagem
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'nsr-ecommerce/products',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              logger.error('Erro no upload do Cloudinary:', error);
              reject(new InternalServerError('Erro ao fazer upload da imagem'));
            } else if (result) {
              logger.info(`Imagem enviada: ${result.secure_url}`);
              resolve(result.secure_url);
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      logger.error('Erro ao fazer upload:', error);
      throw new InternalServerError('Erro ao fazer upload da imagem');
    }
  }

  /**
   * Upload de múltiplas imagens
   * @param files - Array de arquivos Multer
   * @returns Array de URLs seguras
   */
  async uploadMultiple(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      logger.error('Erro ao fazer upload de múltiplas imagens:', error);
      throw new InternalServerError('Erro ao fazer upload das imagens');
    }
  }

  /**
   * Deletar imagem do Cloudinary
   * @param imageUrl - URL da imagem
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(imageUrl);
      
      if (!publicId) {
        logger.warn(`URL inválida para deleção: ${imageUrl}`);
        return;
      }

      await cloudinary.uploader.destroy(publicId);
      logger.info(`Imagem deletada: ${publicId}`);
    } catch (error) {
      logger.error('Erro ao deletar imagem:', error);
      throw new InternalServerError('Erro ao deletar imagem');
    }
  }

  /**
   * Deletar múltiplas imagens
   * @param imageUrls - Array de URLs
   */
  async deleteMultiple(imageUrls: string[]): Promise<void> {
    try {
      const deletePromises = imageUrls.map((url) => this.deleteImage(url));
      await Promise.all(deletePromises);
    } catch (error) {
      logger.error('Erro ao deletar múltiplas imagens:', error);
      throw new InternalServerError('Erro ao deletar imagens');
    }
  }

  /**
   * Extrair publicId da URL do Cloudinary
   * @param url - URL completa da imagem
   * @returns publicId ou null
   */
  private extractPublicId(url: string): string | null {
    try {
      // URL do Cloudinary: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
      const regex = /\/v\d+\/(.+)\.\w+$/;
      const match = url.match(regex);
      return match && match[1] ? match[1] : null;
    } catch (error) {
      logger.error('Erro ao extrair publicId:', error);
      return null;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
