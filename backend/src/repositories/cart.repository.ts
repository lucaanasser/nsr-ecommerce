import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { prisma } from '../config/database';

type Cart = Prisma.CartGetPayload<{}>;
type CartItem = Prisma.CartItemGetPayload<{}>;

/**
 * Cart Repository
 * Gerencia todas as operações de banco de dados relacionadas ao carrinho
 */
export class CartRepository extends BaseRepository<Cart> {
  protected model = prisma.cart;

  /**
   * Encontra carrinho por userId
   */
  async findByUserId(userId: string): Promise<Cart | null> {
    return this.model.findUnique({
      where: { userId },
    });
  }

  /**
   * Encontra carrinho com itens
   */
  async findWithItems(userId: string) {
    return this.model.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                stock: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Cria carrinho para usuário
   */
  async createCart(userId: string): Promise<Cart> {
    return this.model.create({
      data: {
        userId,
      },
    });
  }

  /**
   * Encontra ou cria carrinho do usuário
   */
  async findOrCreate(userId: string): Promise<Cart> {
    let cart = await this.findByUserId(userId);
    
    if (!cart) {
      cart = await this.createCart(userId);
    }
    
    return cart;
  }

  /**
   * Adiciona item ao carrinho
   */
  async addItem(
    cartId: string,
    productId: string,
    size: string,
    color: string,
    quantity: number
  ): Promise<CartItem> {
    // Verifica se item já existe no carrinho
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_size_color: {
          cartId,
          productId,
          size,
          color,
        },
      },
    });

    if (existingItem) {
      // Atualiza quantidade se item já existe
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    }

    // Cria novo item
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        size,
        color,
        quantity,
      },
    });
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateItemQuantity(
    itemId: string,
    quantity: number
  ): Promise<CartItem> {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  /**
   * Remove item do carrinho
   */
  async removeItem(itemId: string): Promise<CartItem> {
    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Limpa todos os itens do carrinho
   */
  async clearCart(userId: string): Promise<void> {
    const cart = await this.findByUserId(userId);
    
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }

  /**
   * Conta total de itens no carrinho
   */
  async countItems(userId: string): Promise<number> {
    const cart = await this.findByUserId(userId);
    
    if (!cart) return 0;

    const result = await prisma.cartItem.aggregate({
      where: { cartId: cart.id },
      _sum: {
        quantity: true,
      },
    });

    return result._sum.quantity || 0;
  }

  /**
   * Calcula total do carrinho
   */
  async calculateTotal(userId: string): Promise<{
    subtotal: number;
    itemCount: number;
  }> {
    const cart = await this.findWithItems(userId);
    
    if (!cart || !cart.items.length) {
      return { subtotal: 0, itemCount: 0 };
    }

    let subtotal = 0;
    let itemCount = 0;

    for (const item of cart.items) {
      if (item.product.isActive && item.product.stock > 0) {
        subtotal += Number(item.product.price) * item.quantity;
        itemCount += item.quantity;
      }
    }

    return { subtotal, itemCount };
  }

  /**
   * Valida disponibilidade dos itens do carrinho
   */
  async validateCartItems(userId: string): Promise<{
    valid: boolean;
    invalidItems: Array<{
      itemId: string;
      productName: string;
      reason: string;
    }>;
  }> {
    const cart = await this.findWithItems(userId);
    
    if (!cart) {
      return { valid: true, invalidItems: [] };
    }

    const invalidItems: Array<{
      itemId: string;
      productName: string;
      reason: string;
    }> = [];

    for (const item of cart.items) {
      // Verifica se produto está ativo
      if (!item.product.isActive) {
        invalidItems.push({
          itemId: item.id,
          productName: item.product.name,
          reason: 'Produto não está mais disponível',
        });
        continue;
      }

      // Verifica estoque
      if (item.product.stock < item.quantity) {
        invalidItems.push({
          itemId: item.id,
          productName: item.product.name,
          reason: `Estoque insuficiente. Disponível: ${item.product.stock}`,
        });
      }
    }

    return {
      valid: invalidItems.length === 0,
      invalidItems,
    };
  }
}

// Exporta instância única (Singleton)
export const cartRepository = new CartRepository();
