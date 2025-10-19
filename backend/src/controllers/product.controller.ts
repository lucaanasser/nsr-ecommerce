/**
 * Controller responsável por manipular requisições HTTP relacionadas a produtos, categorias e coleções.
 * Implementa endpoints públicos para listagem, busca e detalhes de produtos.
 */
import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import { collectionService } from '../services/collection.service';
import { ProductFilters, Pagination } from '../types/product.types';

/**
 * Product Controller (Público)
 * Manipula requests HTTP relacionados a produtos (endpoints públicos)
 */
export class ProductController {
  /**
   * GET /api/v1/products
   * Lista produtos com filtros e paginação
   */
  async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extrair filtros da query
      const filters: ProductFilters = {
        search: req.query['search'] as string,
        categoryId: req.query['categoryId'] as string,
        collectionId: req.query['collectionId'] as string,
        gender: req.query['gender'] as 'MALE' | 'FEMALE' | 'UNISEX',
        minPrice: req.query['minPrice'] ? Number(req.query['minPrice']) : undefined,
        maxPrice: req.query['maxPrice'] ? Number(req.query['maxPrice']) : undefined,
        isFeatured: req.query['isFeatured'] === 'true',
        isActive: true, // Apenas produtos ativos para público
      };

      // Extrair paginação da query
      const pagination: Pagination = {
        page: req.query['page'] ? Number(req.query['page']) : 1,
        limit: req.query['limit'] ? Number(req.query['limit']) : 20,
        orderBy: req.query['orderBy'] as Pagination['orderBy'],
      };

      const result = await productService.getProducts(filters, pagination);

      res.status(200).json({
        success: true,
        message: 'Produtos recuperados com sucesso',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/products/featured
   * Lista produtos em destaque
   */
  async getFeaturedProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = req.query['limit'] ? Number(req.query['limit']) : 10;
      const products = await productService.getFeaturedProducts(limit);

      res.status(200).json({
        success: true,
        message: 'Produtos em destaque recuperados com sucesso',
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/products/:slug
   * Busca produto por slug
   */
  async getProductBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await productService.getProductBySlug(slug!);

      res.status(200).json({
        success: true,
        message: 'Produto recuperado com sucesso',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/categories
   * Lista todas as categorias
   */
  async getCategories(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await categoryService.getCategories();

      res.status(200).json({
        success: true,
        message: 'Categorias recuperadas com sucesso',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/categories/:slug
   * Busca categoria por slug
   */
  async getCategoryBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await categoryService.getCategoryBySlug(slug!);

      res.status(200).json({
        success: true,
        message: 'Categoria recuperada com sucesso',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/collections
   * Lista todas as coleções
   */
  async getCollections(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const collections = await collectionService.getCollections();

      res.status(200).json({
        success: true,
        message: 'Coleções recuperadas com sucesso',
        data: collections,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/collections/:slug
   * Busca coleção por slug
   */
  async getCollectionBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slug } = req.params;
      const collection = await collectionService.getCollectionBySlug(slug!);

      res.status(200).json({
        success: true,
        message: 'Coleção recuperada com sucesso',
        data: collection,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
