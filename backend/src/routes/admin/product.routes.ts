/**
 * Rotas administrativas para gerenciamento de produtos, categorias e coleções.
 * Inclui endpoints de CRUD, upload de imagens e exige autenticação ADMIN.
 */
import { Router } from 'express';
import { adminProductController } from '../../controllers/admin/product.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateBody, validateParams } from '../../middlewares/validate';
import { uploadMultiple } from '../../middlewares/upload';
import {
  createProductSchema,
  updateProductSchema,
  uuidParamSchema,
  createCollectionSchema,
  updateCollectionSchema,
} from '../../validators/product.validator';

const router = Router();

// Todas as rotas requerem autenticação e role ADMIN
router.use(authenticate as any);
router.use(authorize('ADMIN') as any);

// ========== PRODUCT ROUTES ==========

/**
 * @route   POST /api/v1/admin/products
 * @desc    Cria novo produto
 * @access  Private (Admin)
 */
router.post(
  '/',
  validateBody(createProductSchema),
  adminProductController.createProduct.bind(adminProductController)
);

/**
 * @route   PUT /api/v1/admin/products/:id
 * @desc    Atualiza produto existente
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  validateParams(uuidParamSchema),
  validateBody(updateProductSchema),
  adminProductController.updateProduct.bind(adminProductController)
);

/**
 * @route   DELETE /api/v1/admin/products/:id
 * @desc    Deleta produto (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  validateParams(uuidParamSchema),
  adminProductController.deleteProduct.bind(adminProductController)
);

/**
 * @route   POST /api/v1/admin/products/:id/images
 * @desc    Upload de múltiplas imagens para produto
 * @access  Private (Admin)
 */
router.post(
  '/:id/images',
  validateParams(uuidParamSchema),
  uploadMultiple,
  adminProductController.uploadImages.bind(adminProductController)
);

/**
 * @route   DELETE /api/v1/admin/products/:id/images/:imageId
 * @desc    Remove uma imagem de um produto
 * @access  Private (Admin)
 */
router.delete(
  '/:id/images/:imageId',
  validateParams(uuidParamSchema),
  adminProductController.deleteImage.bind(adminProductController)
);

// ========== COLLECTION ROUTES ==========

/**
 * @route   POST /api/v1/admin/collections
 * @desc    Cria nova coleção
 * @access  Private (Admin)
 */
router.post(
  '/collections',
  validateBody(createCollectionSchema),
  adminProductController.createCollection.bind(adminProductController)
);

/**
 * @route   PUT /api/v1/admin/collections/:id
 * @desc    Atualiza coleção existente
 * @access  Private (Admin)
 */
router.put(
  '/collections/:id',
  validateParams(uuidParamSchema),
  validateBody(updateCollectionSchema),
  adminProductController.updateCollection.bind(adminProductController)
);

/**
 * @route   DELETE /api/v1/admin/collections/:id
 * @desc    Deleta coleção
 * @access  Private (Admin)
 */
router.delete(
  '/collections/:id',
  validateParams(uuidParamSchema),
  adminProductController.deleteCollection.bind(adminProductController)
);

export default router;
