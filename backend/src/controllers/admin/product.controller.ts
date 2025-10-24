import { Request, Response, NextFunction } from 'express';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import { collectionService } from '../../services/collection.service';
import { cloudinaryService } from '../../services/cloudinary.service';
import { BadRequestError, NotFoundError } from '../../utils/errors';

/**
 * Admin Product Controller
 * Manipula requests HTTP relacionados a produtos (endpoints admin)
 */
export class AdminProductController {
  /**
   * POST /api/v1/admin/products
   * Cria novo produto
   */
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/products/:id
   * Atualiza produto existente
   */
  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id!, req.body);

      res.status(200).json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/products/:id
   * Deleta produto (soft delete)
   */
  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id!);

      res.status(200).json({
        success: true,
        message: 'Produto deletado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/products/:id/images
   * Upload de múltiplas imagens para um produto
   */
  async uploadImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new BadRequestError('Nenhuma imagem foi enviada');
      }

      // Upload para Cloudinary
      const imageUrls = await cloudinaryService.uploadMultiple(files);

      // Buscar produto atual
      const product = await productService.getProductById(id!);
      if (!product) {
        throw new NotFoundError('Produto não encontrado');
      }

      // Criar array de novas imagens
      const currentImages = product.images || [];
      const nextOrder = currentImages.length;
      
      const newImages = imageUrls.map((url, index) => ({
        url,
        altText: `${product.name} - Imagem ${nextOrder + index + 1}`,
        order: nextOrder + index,
        isPrimary: currentImages.length === 0 && index === 0, // Primeira imagem é primary se não houver outras
      }));

      // Combinar imagens existentes com novas
      const allImages = [
        ...currentImages.map(img => ({
          id: img.id,
          url: img.url,
          altText: img.altText || undefined,
          order: img.order,
          isPrimary: img.isPrimary,
        })),
        ...newImages,
      ];

      // Atualizar produto
      const updatedProduct = await productService.updateProduct(id!, {
        images: allImages,
      });

      res.status(200).json({
        success: true,
        message: 'Imagens enviadas com sucesso',
        data: {
          product: updatedProduct,
          uploadedImages: newImages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/products/:id/images/:imageId
   * Remove uma imagem de um produto
   */
  async deleteImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, imageId } = req.params;

      if (!imageId) {
        throw new BadRequestError('ID da imagem é obrigatório');
      }

      // Buscar produto
      const product = await productService.getProductById(id!);
      if (!product) {
        throw new NotFoundError('Produto não encontrado');
      }

      // Encontrar a imagem
      const imageToDelete = product.images?.find(img => img.id === imageId);
      if (!imageToDelete) {
        throw new BadRequestError('Imagem não encontrada no produto');
      }

      // Deletar do Cloudinary
      await cloudinaryService.deleteImage(imageToDelete.url);

      // Remover da lista e reorganizar ordem
      const remainingImages = product.images!
        .filter(img => img.id !== imageId)
        .map((img, index) => ({
          id: img.id,
          url: img.url,
          altText: img.altText || undefined,
          order: index,
          isPrimary: index === 0, // Primeira imagem sempre é primary
        }));

      // Atualizar produto
      const updatedProduct = await productService.updateProduct(id!, {
        images: remainingImages,
      });

      res.status(200).json({
        success: true,
        message: 'Imagem deletada com sucesso',
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  // ========== CATEGORY METHODS ==========

  /**
   * POST /api/v1/admin/categories
   * Cria nova categoria
   */
  async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const category = await categoryService.createCategory(req.body);

      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/categories/:id
   * Atualiza categoria existente
   */
  async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id!, req.body);

      res.status(200).json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/categories/:id
   * Deleta categoria
   */
  async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id!);

      res.status(200).json({
        success: true,
        message: 'Categoria deletada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  // ========== COLLECTION METHODS ==========

  /**
   * POST /api/v1/admin/collections
   * Cria nova coleção
   */
  async createCollection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const collection = await collectionService.createCollection(req.body);

      res.status(201).json({
        success: true,
        message: 'Coleção criada com sucesso',
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/collections/:id
   * Atualiza coleção existente
   */
  async updateCollection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const collection = await collectionService.updateCollection(id!, req.body);

      res.status(200).json({
        success: true,
        message: 'Coleção atualizada com sucesso',
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/collections/:id
   * Deleta coleção
   */
  async deleteCollection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await collectionService.deleteCollection(id!);

      res.status(200).json({
        success: true,
        message: 'Coleção deletada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminProductController = new AdminProductController();
