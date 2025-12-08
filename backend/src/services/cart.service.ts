/**
 * Service responsável por toda a lógica de negócio do carrinho de compras.
 * Implementa operações de busca, adição, atualização e remoção de itens do carrinho.
 */
import { 
  AddItemDTO, 
  CartResponse, 
  CartItemResponse, 
  CartSummary,
  UpdateItemDTO,
} from '../types/cart.types';
import { cartRepository } from '@repositories/cart.repository';
import { productRepository } from '@repositories/product.repository';
import { 
  NotFoundError, 
  BadRequestError,
} from '@utils/errors';
import { logger } from '@config/logger.colored';

/**
 * Cart Service
 * Contém toda a lógica de negócio relacionada ao carrinho de compras
 */
export class CartService {
  /**
   * Busca o carrinho do usuário
   */
  async getCart(userId: string): Promise<CartResponse> {
    logger.info(`Getting cart for user ${userId}`);

    // Buscar ou criar carrinho
    const cart = await cartRepository.findOrCreate(userId);
    
    // Buscar carrinho com itens
    const cartWithItems = await cartRepository.findWithItems(userId);

    if (!cartWithItems) {
      // Retornar carrinho vazio
      return {
        id: cart.id,
        userId: cart.userId,
        items: [],
        summary: {
          subtotal: 0,
          itemCount: 0,
          totalQuantity: 0,
        },
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      };
    }

    // Formatar itens e calcular totais
    const items: CartItemResponse[] = cartWithItems.items.map((item) => {
      // Pegar primeira imagem ou array vazio
      const productImages = item.product.images && item.product.images.length > 0
        ? item.product.images.map((img: any) => img.url)
        : [];
      
      return {
        id: item.id,
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: Number(item.product.price),
          images: productImages,
          stock: item.product.stock,
          isActive: item.product.isActive,
        },
        size: item.size || '',
        color: item.color || '',
        quantity: item.quantity,
        subtotal: Number(item.product.price) * item.quantity,
      };
    });

    // Calcular resumo
    const summary: CartSummary = {
      subtotal: items.reduce((acc, item) => acc + item.subtotal, 0),
      itemCount: items.length,
      totalQuantity: items.reduce((acc, item) => acc + item.quantity, 0),
    };

    return {
      id: cartWithItems.id,
      userId: cartWithItems.userId,
      items,
      summary,
      createdAt: cartWithItems.createdAt,
      updatedAt: cartWithItems.updatedAt,
    };
  }

  /**
   * Adiciona item ao carrinho
   */
  async addItem(userId: string, data: AddItemDTO): Promise<CartResponse> {
    const { productId, size, color, quantity } = data;

    logger.info(`Adding item to cart: user=${userId}, product=${productId}, size=${size}, color=${color}, qty=${quantity}`);

    // 1. Verificar se produto existe
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Produto não encontrado');
    }

    // 2. Verificar se produto está ativo
    if (!product.isActive) {
      throw new BadRequestError('Este produto não está mais disponível');
    }

    // 3. Verificar estoque (sem permitir produtos zerados)
    if (product.stock <= 0) {
      throw new BadRequestError('Produto sem estoque disponível');
    }

    // 4. Buscar ou criar carrinho
    const cart = await cartRepository.findOrCreate(userId);

    // 5. Verificar se já existe item igual no carrinho para checar estoque total
    const cartWithItems = await cartRepository.findWithItems(userId);
    const existingItem = cartWithItems?.items.find(
      (i) => i.productId === productId && i.size === size && i.color === color
    );
    const requestedTotal = (existingItem?.quantity ?? 0) + quantity;

    if (product.stock < requestedTotal) {
      throw new BadRequestError(
        `Estoque insuficiente. Disponível: ${product.stock} unidade(s)`
      );
    }

    // 6. Adicionar item ao carrinho
    await cartRepository.addItem(cart.id, productId, size, color, quantity);

    logger.info(`Item added successfully to cart ${cart.id}`);

    // 6. Retornar carrinho atualizado
    return this.getCart(userId);
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateItem(
    userId: string,
    itemId: string,
    data: UpdateItemDTO
  ): Promise<CartResponse> {
    const { quantity } = data;

    logger.info(`Updating cart item ${itemId} for user ${userId}: qty=${quantity}`);

    // 1. Buscar carrinho do usuário
    const cart = await cartRepository.findWithItems(userId);
    if (!cart) {
      throw new NotFoundError('Carrinho não encontrado');
    }

    // 2. Verificar se item existe e pertence ao usuário
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundError('Item não encontrado no carrinho');
    }

    // 3. Verificar se produto ainda está ativo
    if (!item.product.isActive) {
      throw new BadRequestError('Este produto não está mais disponível');
    }

    // 4. Verificar estoque (sem permitir estoque zerado)
    if (item.product.stock <= 0) {
      throw new BadRequestError('Produto sem estoque disponível');
    }

    if (item.product.stock < quantity) {
      throw new BadRequestError(
        `Estoque insuficiente. Disponível: ${item.product.stock} unidade(s)`
      );
    }

    // 5. Atualizar quantidade
    await cartRepository.updateItemQuantity(itemId, quantity);

    logger.info(`Item ${itemId} updated successfully`);

    // 6. Retornar carrinho atualizado
    return this.getCart(userId);
  }

  /**
   * Remove item do carrinho
   */
  async removeItem(userId: string, itemId: string): Promise<void> {
    logger.info(`Removing item ${itemId} from cart for user ${userId}`);

    // 1. Buscar carrinho do usuário
    const cart = await cartRepository.findWithItems(userId);
    if (!cart) {
      throw new NotFoundError('Carrinho não encontrado');
    }

    // 2. Verificar se item existe e pertence ao usuário
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundError('Item não encontrado no carrinho');
    }

    // 3. Remover item
    await cartRepository.removeItem(itemId);

    logger.info(`Item ${itemId} removed successfully`);
  }

  /**
   * Limpa todos os itens do carrinho
   */
  async clearCart(userId: string): Promise<void> {
    logger.info(`Clearing cart for user ${userId}`);

    await cartRepository.clearCart(userId);

    logger.info(`Cart cleared successfully for user ${userId}`);
  }

  /**
   * Valida todos os itens do carrinho
   * Útil antes de finalizar um pedido
   */
  async validateCart(userId: string) {
    logger.info(`Validating cart for user ${userId}`);

    const result = await cartRepository.validateCartItems(userId);

    return result;
  }
}

// Exporta instância única (Singleton)
export const cartService = new CartService();
