import { Request, Response, NextFunction } from 'express';
import { cartService } from '@services/cart.service';
import { AddItemDTO, UpdateItemDTO } from '../types/cart.types';

/**
 * Cart Controller
 * Handlers para endpoints do carrinho de compras
 */

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get user's cart
 *     description: Returns the authenticated user's shopping cart with all items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 summary:
 *                   type: object
 *                   properties:
 *                     subtotal:
 *                       type: number
 *                     itemCount:
 *                       type: number
 *                     totalQuantity:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const cart = await cartService.getCart(userId);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     description: Adds a product to the user's cart or increments quantity if already exists
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - size
 *               - color
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               size:
 *                 type: string
 *                 example: "M"
 *               color:
 *                 type: string
 *                 example: "Preto"
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added successfully
 *       400:
 *         description: Product inactive or insufficient stock
 *       404:
 *         description: Product not found
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data: AddItemDTO = req.body;

    const cart = await cartService.addItem(userId, data);

    res.status(201).json({
      message: 'Item adicionado ao carrinho com sucesso',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/cart/items/{id}:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item quantity
 *     description: Updates the quantity of a specific item in the cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 3
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Product inactive or insufficient stock
 *       404:
 *         description: Item not found
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data: UpdateItemDTO = req.body;

    if (!id) {
      throw new Error('Item ID is required');
    }

    const cart = await cartService.updateItem(userId, id, data);

    res.status(200).json({
      message: 'Item atualizado com sucesso',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/cart/items/{id}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     description: Removes a specific item from the user's cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found
 */
export const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!id) {
      throw new Error('Item ID is required');
    }

    await cartService.removeItem(userId, id);

    res.status(200).json({
      message: 'Item removido do carrinho com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear cart
 *     description: Removes all items from the user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    await cartService.clearCart(userId);

    res.status(200).json({
      message: 'Carrinho limpo com sucesso',
    });
  } catch (error) {
    next(error);
  }
};
