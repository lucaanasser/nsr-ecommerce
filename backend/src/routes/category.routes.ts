import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validateParams } from '../middlewares/validate';
import { slugParamSchema } from '../validators/product.validator';

const router = Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Lista todas as categorias
 * @access  Public
 */
router.get(
  '/',
  productController.getCategories.bind(productController)
);

/**
 * @route   GET /api/v1/categories/:slug
 * @desc    Busca categoria por slug
 * @access  Public
 */
router.get(
  '/:slug',
  validateParams(slugParamSchema),
  productController.getCategoryBySlug.bind(productController)
);

export default router;
