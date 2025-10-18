import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validateParams } from '../middlewares/validate';
import { slugParamSchema } from '../validators/product.validator';

const router = Router();

/**
 * @route   GET /api/v1/collections
 * @desc    Lista todas as coleções
 * @access  Public
 */
router.get(
  '/',
  productController.getCollections.bind(productController)
);

/**
 * @route   GET /api/v1/collections/:slug
 * @desc    Busca coleção por slug
 * @access  Public
 */
router.get(
  '/:slug',
  validateParams(slugParamSchema),
  productController.getCollectionBySlug.bind(productController)
);

export default router;
