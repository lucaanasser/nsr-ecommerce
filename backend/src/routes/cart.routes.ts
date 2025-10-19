/**
 * Rotas responsáveis por operações do carrinho de compras do usuário autenticado.
 * Inclui endpoints para adicionar, atualizar, remover e listar itens do carrinho.
 */
import { Router } from 'express';
import { authenticate } from '@middlewares/authenticate';
import { validateBody } from '@middlewares/validate';
import { 
  addItemSchema, 
  updateItemSchema,
} from '@validators/cart.validator';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from '../controllers/cart.controller';

const router = Router();

/**
 * Todas as rotas de carrinho requerem autenticação
 */

// GET /api/v1/cart - Buscar carrinho do usuário
router.get('/', authenticate, getCart);

// POST /api/v1/cart/items - Adicionar item ao carrinho
router.post(
  '/items',
  authenticate,
  validateBody(addItemSchema),
  addItem
);

// PUT /api/v1/cart/items/:id - Atualizar quantidade do item
router.put(
  '/items/:id',
  authenticate,
  validateBody(updateItemSchema),
  updateItem
);

// DELETE /api/v1/cart/items/:id - Remover item do carrinho
router.delete(
  '/items/:id',
  authenticate,
  removeItem
);

// DELETE /api/v1/cart - Limpar carrinho
router.delete('/', authenticate, clearCart);

export default router;
