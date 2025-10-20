/**
 * Repositório responsável por todas as operações de banco de dados relacionadas a produtos.
 * Implementa métodos customizados para busca, filtros, variantes e reviews.
 */
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { prisma } from '../config/database';

type Product = Prisma.ProductGetPayload<{}>;

/**
 * Filtros de busca de produtos
 */
export interface ProductFilters {
  categoryId?: string;
  collectionId?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  search?: string;
}

/**
 * Product Repository
 * Gerencia todas as operações de banco de dados relacionadas a produtos
 */
export class ProductRepository extends BaseRepository<Product> {
  protected model = prisma.product;

  /**
   * Encontra produto por slug
   */
  async findBySlug(slug: string): Promise<Product | null> {
    return this.model.findUnique({
      where: { slug },
      include: {
        category: true,
        collection: true,
        variants: true,
      },
    });
  }

  /**
   * Encontra produto por SKU
   */
  async findBySku(sku: string): Promise<Product | null> {
    return this.model.findUnique({
      where: { sku },
    });
  }

  /**
   * Encontra produto com variantes
   */
  async findWithVariants(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        variants: {
          where: {
            stock: {
              gt: 0, // Apenas variantes em estoque
            },
          },
        },
      },
    });
  }

  /**
   * Encontra produto com reviews
   */
  async findWithReviews(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        reviews: {
          where: {
            isApproved: true,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  /**
   * Busca produtos com filtros avançados
   */
  async search(filters: ProductFilters, options?: {
    take?: number;
    skip?: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const where: Prisma.ProductWhereInput = {
      isActive: filters.isActive ?? true,
    };

    // Filtro por categoria
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Filtro por coleção
    if (filters.collectionId) {
      where.collectionId = filters.collectionId;
    }

    // Filtro por gênero
    if (filters.gender) {
      where.gender = filters.gender as any;
    }

    // Filtro por preço
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Filtro por estoque
    if (filters.inStock) {
      where.stock = {
        gt: 0,
      };
    }

    // Filtro por destaque
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    // Busca por texto
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.model.findMany({
      where,
      take: options?.take,
      skip: options?.skip,
      orderBy: options?.orderBy ?? { createdAt: 'desc' },
      include: {
        category: true,
        collection: true,
        variants: {
          where: {
            stock: { gt: 0 },
          },
        },
      },
    });
  }

  /**
   * Encontra produtos em destaque
   */
  async findFeatured(limit = 8) {
    return this.model.findMany({
      where: {
        isFeatured: true,
        isActive: true,
        stock: {
          gt: 0,
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        variants: {
          where: {
            stock: { gt: 0 },
          },
        },
      },
    });
  }

  /**
   * Encontra produtos por categoria
   */
  async findByCategory(categoryId: string, options?: {
    take?: number;
    skip?: number;
  }) {
    return this.model.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      take: options?.take,
      skip: options?.skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  /**
   * Encontra produtos por coleção
   */
  async findByCollection(collectionId: string, options?: {
    take?: number;
    skip?: number;
  }) {
    return this.model.findMany({
      where: {
        collectionId,
        isActive: true,
      },
      take: options?.take,
      skip: options?.skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        collection: true,
        variants: true,
      },
    });
  }

  /**
   * Encontra produtos relacionados (mesma categoria, exceto o atual)
   */
  async findRelated(productId: string, categoryId: string, limit = 4) {
    return this.model.findMany({
      where: {
        categoryId,
        isActive: true,
        id: {
          not: productId,
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Atualiza estoque do produto
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.model.update({
      where: { id },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }

  /**
   * Decrementa estoque do produto
   */
  async decrementStock(id: string, quantity: number): Promise<Product> {
    return this.model.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }

  /**
   * Calcula estatísticas de produtos
   */
  async getStats() {
    const [total, active, outOfStock, featured] = await Promise.all([
      this.model.count(),
      this.model.count({ where: { isActive: true } }),
      this.model.count({ where: { stock: 0 } }),
      this.model.count({ where: { isFeatured: true } }),
    ]);

    return {
      total,
      active,
      outOfStock,
      featured,
    };
  }
}

// Exporta instância única (Singleton)
export const productRepository = new ProductRepository();
