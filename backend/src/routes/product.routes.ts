/**
 * Rotas responsáveis por listagem, busca e detalhes de produtos.
 * Define endpoints públicos para produtos, incluindo filtros e destaques.
 */
import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validateQuery, validateParams } from '../middlewares/validate';
import {
  productFiltersSchema,
  paginationSchema,
  slugParamSchema,
} from '../validators/product.validator';

const router = Router();

// ========== PRODUCT ROUTES ==========

/**
 * @route   GET /api/v1/products
 * @desc    Lista produtos com filtros e paginação
 * @access  Public
 */
router.get(
  '/',
  validateQuery(productFiltersSchema),
  validateQuery(paginationSchema),
  productController.getProducts.bind(productController)
);

/**
 * @route   GET /api/v1/products/featured
 * @desc    Lista produtos em destaque
 * @access  Public
 */
router.get(
  '/featured',
  productController.getFeaturedProducts.bind(productController)
);

/**
 * @route   GET /api/v1/products/:slug
 * @desc    Busca produto por slug
 * @access  Public
 */
router.get(
  '/:slug',
  validateParams(slugParamSchema),
  productController.getProductBySlug.bind(productController)
);



export default router;
