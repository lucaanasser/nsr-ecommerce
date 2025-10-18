import { Prisma } from '@prisma/client';
import { productRepository } from '../repositories/product.repository';
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
  Pagination,
  PaginatedResponse,
  ProductResponse,
} from '../types/product.types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../config/logger';

class ProductService {
  /**
   * Buscar produtos com filtros e paginação
   */
  async getProducts(
    filters: ProductFilters,
    pagination: Pagination
  ): Promise<PaginatedResponse<ProductResponse>> {
    const { page, limit, orderBy } = pagination;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: Prisma.ProductWhereInput = {
      isActive: filters.isActive ?? true, // Por padrão, mostrar apenas ativos
    };

    // Filtro de busca (nome ou descrição)
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filtros específicos
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.collectionId) where.collectionId = filters.collectionId;
    if (filters.gender) where.gender = filters.gender;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;

    // Filtro de preço
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
      }
    }

    // Ordenação
    let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (orderBy) {
      case 'price_asc':
        orderByClause = { price: 'asc' };
        break;
      case 'price_desc':
        orderByClause = { price: 'desc' };
        break;
      case 'newest':
        orderByClause = { createdAt: 'desc' };
        break;
      case 'popular':
        orderByClause = { orderItems: { _count: 'desc' } };
        break;
      case 'name_asc':
        orderByClause = { name: 'asc' };
        break;
      case 'name_desc':
        orderByClause = { name: 'desc' };
        break;
    }

    // Buscar produtos
    const [products, total] = await Promise.all([
      productRepository.search(filters, {
        skip,
        take: limit,
        orderBy: orderByClause,
      }),
      productRepository.count(where),
    ]);

    // Formatar resposta
    const data = products.map(this.formatProduct);
    const totalPages = Math.ceil(total / limit);

    logger.info('Products fetched', {
      filters,
      pagination,
      total,
      returned: products.length,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Buscar produto por slug
   */
  async getProductBySlug(slug: string): Promise<ProductResponse> {
    const product = await productRepository.findBySlug(slug);

    if (!product) {
      throw new NotFoundError('Produto não encontrado');
    }

    logger.info('Product fetched by slug', { slug, productId: product.id });

    return this.formatProduct(product);
  }

  /**
   * Buscar produto por ID
   */
  async getProductById(id: string): Promise<ProductResponse> {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Produto não encontrado');
    }

    return this.formatProduct(product);
  }

  /**
   * Criar produto (Admin)
   */
  async createProduct(data: CreateProductDTO): Promise<ProductResponse> {
    // Verificar se slug já existe
    const existingProduct = await productRepository.findBySlug(data.slug);
    if (existingProduct) {
      throw new ValidationError('Slug já está em uso');
    }

    // Verificar se SKU já existe (se fornecido)
    if (data.sku) {
      const existingSku = await productRepository.findBySku(data.sku);
      if (existingSku) {
        throw new ValidationError('SKU já está em uso');
      }
    }

    const product = await productRepository.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        comparePrice: data.comparePrice ? new Prisma.Decimal(data.comparePrice) : null,
        stock: data.stock,
        sku: data.sku,
        categoryId: data.categoryId,
        collectionId: data.collectionId,
        gender: data.gender || 'UNISEX',
        images: data.images || [],
        weight: data.weight ? new Prisma.Decimal(data.weight) : null,
        length: data.length ? new Prisma.Decimal(data.length) : null,
        width: data.width ? new Prisma.Decimal(data.width) : null,
        height: data.height ? new Prisma.Decimal(data.height) : null,
        material: data.material,
        careInstructions: data.careInstructions,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isFeatured: data.isFeatured || false,
        isActive: data.isActive ?? true,
        // Criar variantes se fornecidas
        variants: data.variants
          ? {
              create: data.variants.map((v) => ({
                size: v.size,
                color: v.color,
                sku: v.sku,
                stock: v.stock,
                price: v.price ? new Prisma.Decimal(v.price) : null,
                comparePrice: v.comparePrice ? new Prisma.Decimal(v.comparePrice) : null,
              })),
            }
          : undefined,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        collection: {
          select: { id: true, name: true, slug: true },
        },
        variants: true,
      },
    });

    logger.info('Product created', { productId: product.id, name: product.name });

    return this.formatProduct(product);
  }

  /**
   * Atualizar produto (Admin)
   */
  async updateProduct(id: string, data: UpdateProductDTO): Promise<ProductResponse> {
    // Verificar se produto existe
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Produto não encontrado');
    }

    // Verificar slug único (se estiver sendo alterado)
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await productRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new ValidationError('Slug já está em uso');
      }
    }

    // Verificar SKU único (se estiver sendo alterado)
    if (data.sku && data.sku !== existing.sku) {
      const skuExists = await productRepository.findBySku(data.sku);
      if (skuExists) {
        throw new ValidationError('SKU já está em uso');
      }
    }

    const updateData: Prisma.ProductUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price);
    if (data.comparePrice !== undefined)
      updateData.comparePrice = data.comparePrice ? new Prisma.Decimal(data.comparePrice) : null;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.weight !== undefined)
      updateData.weight = data.weight ? new Prisma.Decimal(data.weight) : null;
    if (data.length !== undefined)
      updateData.length = data.length ? new Prisma.Decimal(data.length) : null;
    if (data.width !== undefined)
      updateData.width = data.width ? new Prisma.Decimal(data.width) : null;
    if (data.height !== undefined)
      updateData.height = data.height ? new Prisma.Decimal(data.height) : null;
    if (data.material !== undefined) updateData.material = data.material;
    if (data.careInstructions !== undefined) updateData.careInstructions = data.careInstructions;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    
    // Relações precisam usar connect/disconnect
    if (data.categoryId !== undefined) {
      updateData.category = data.categoryId ? { connect: { id: data.categoryId } } : { disconnect: true };
    }
    if (data.collectionId !== undefined) {
      updateData.collection = data.collectionId ? { connect: { id: data.collectionId } } : { disconnect: true };
    }

    const product = await productRepository.update(id, updateData);

    logger.info('Product updated', { productId: id, changes: Object.keys(data) });

    return this.formatProduct(product);
  }

  /**
   * Deletar produto - Soft Delete (Admin)
   */
  async deleteProduct(id: string): Promise<void> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Produto não encontrado');
    }

    // Soft delete: apenas marcar como inativo
    await productRepository.update(id, { isActive: false });

    logger.info('Product soft deleted', { productId: id, name: product.name });
  }

  /**
   * Buscar produtos em destaque
   */
  async getFeaturedProducts(limit: number = 8): Promise<ProductResponse[]> {
    const products = await productRepository.findFeatured(limit);

    return products.map(this.formatProduct);
  }

  /**
   * Formatar produto para resposta
   */
  private formatProduct(product: any): ProductResponse {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      stock: product.stock,
      sku: product.sku,
      gender: product.gender,
      images: product.images,
      weight: product.weight ? Number(product.weight) : null,
      length: product.length ? Number(product.length) : null,
      width: product.width ? Number(product.width) : null,
      height: product.height ? Number(product.height) : null,
      material: product.material,
      careInstructions: product.careInstructions,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category || null,
      collection: product.collection || null,
      variants: product.variants
        ? product.variants.map((v: any) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            sku: v.sku,
            stock: v.stock,
            price: v.price ? Number(v.price) : null,
            comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
          }))
        : undefined,
    };
  }
}

export const productService = new ProductService();
