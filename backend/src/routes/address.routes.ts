/**
 * Address Routes
 * Rotas para gerenciamento de endereços de entrega do usuário
 */
import { Router } from 'express';
import { addressController } from '@controllers/address.controller';
import { authenticate } from '@middlewares/authenticate';
import { validateBody, validateParams } from '@middlewares/validate';
import {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} from '@validators/address.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

/**
 * GET /user/addresses
 * Lista todos os endereços do usuário
 */
router.get('/', addressController.getAddresses);

/**
 * GET /user/addresses/:id
 * Busca um endereço específico
 */
router.get('/:id', validateParams(addressIdParamSchema), addressController.getAddress);

/**
 * POST /user/addresses
 * Cria novo endereço
 */
router.post('/', validateBody(createAddressSchema), addressController.createAddress);

/**
 * PUT /user/addresses/:id
 * Atualiza endereço existente
 */
router.put(
  '/:id',
  validateParams(addressIdParamSchema),
  validateBody(updateAddressSchema),
  addressController.updateAddress
);

/**
 * PATCH /user/addresses/:id/default
 * Define endereço como padrão
 */
router.patch('/:id/default', validateParams(addressIdParamSchema), addressController.setDefaultAddress);

/**
 * DELETE /user/addresses/:id
 * Remove endereço
 */
router.delete('/:id', validateParams(addressIdParamSchema), addressController.deleteAddress);

export default router;
