/**
 * Service responsável por toda a lógica de negócio de produtos.
 * Implementa busca, filtros, paginação, criação, atualização e formatação de produtos.
 */
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
import { logger } from '@config/logger.colored';

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

        // Busca por texto
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { details: { description: { contains: filters.search, mode: 'insensitive' } } },
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
        price: new Prisma.Decimal(data.price),
        comparePrice: data.comparePrice ? new Prisma.Decimal(data.comparePrice) : null,
        stock: data.stock,
        sku: data.sku,
        categoryId: data.categoryId,
        collectionId: data.collectionId,
        gender: data.gender || 'UNISEX',
        isFeatured: data.isFeatured || false,
        isActive: data.isActive ?? true,
        
        // Criar detalhes do produto
        details: data.details
          ? {
              create: {
                description: data.details.description,
                material: data.details.material,
                careInstructions: data.details.careInstructions,
              },
            }
          : undefined,
        
        // Criar dimensões
        dimensions: data.dimensions
          ? {
              create: {
                weight: new Prisma.Decimal(data.dimensions.weight),
                length: new Prisma.Decimal(data.dimensions.length),
                width: new Prisma.Decimal(data.dimensions.width),
                height: new Prisma.Decimal(data.dimensions.height),
              },
            }
          : undefined,
        
        // Criar SEO
        seo: data.seo
          ? {
              create: {
                metaTitle: data.seo.metaTitle,
                metaDescription: data.seo.metaDescription,
                keywords: data.seo.keywords || [],
              },
            }
          : undefined,
        
        // Criar imagens
        images: data.images
          ? {
              create: data.images.map((img, index) => ({
                url: img.url,
                altText: img.altText,
                order: img.order ?? index,
                isPrimary: img.isPrimary ?? index === 0,
              })),
            }
          : undefined,
        
        // Criar variantes se fornecidas
        variants: data.variants
          ? {
              create: data.variants.map((v) => ({
                size: v.size,
                color: v.color,
                sku: v.sku,
                stock: v.stock,
                priceAdjustment: v.price ? new Prisma.Decimal(v.price) : null,
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
        details: true,
        dimensions: true,
        seo: true,
        images: { orderBy: { order: 'asc' } },
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
    
    // Campos básicos
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price);
    if (data.comparePrice !== undefined)
      updateData.comparePrice = data.comparePrice ? new Prisma.Decimal(data.comparePrice) : null;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    
    // Atualizar detalhes
    if (data.details) {
      updateData.details = {
        upsert: {
          create: data.details,
          update: data.details,
        },
      };
    }
    
    // Atualizar dimensões
    if (data.dimensions) {
      updateData.dimensions = {
        upsert: {
          create: {
            weight: new Prisma.Decimal(data.dimensions.weight!),
            length: new Prisma.Decimal(data.dimensions.length!),
            width: new Prisma.Decimal(data.dimensions.width!),
            height: new Prisma.Decimal(data.dimensions.height!),
          },
          update: {
            ...(data.dimensions.weight && { weight: new Prisma.Decimal(data.dimensions.weight) }),
            ...(data.dimensions.length && { length: new Prisma.Decimal(data.dimensions.length) }),
            ...(data.dimensions.width && { width: new Prisma.Decimal(data.dimensions.width) }),
            ...(data.dimensions.height && { height: new Prisma.Decimal(data.dimensions.height) }),
          },
        },
      };
    }
    
    // Atualizar SEO
    if (data.seo) {
      updateData.seo = {
        upsert: {
          create: {
            metaTitle: data.seo.metaTitle,
            metaDescription: data.seo.metaDescription,
            keywords: data.seo.keywords || [],
          },
          update: data.seo,
        },
      };
    }
    
    // Atualizar imagens (deletar todas e recriar)
    if (data.images) {
      updateData.images = {
        deleteMany: {},
        create: data.images.map((img, index) => ({
          url: img.url,
          altText: img.altText,
          order: img.order ?? index,
          isPrimary: img.isPrimary ?? index === 0,
        })),
      };
    }
    
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
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      stock: product.stock,
      sku: product.sku,
      gender: product.gender,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      
      // Dados relacionados
      details: product.details || null,
      
      dimensions: product.dimensions
        ? {
            weight: Number(product.dimensions.weight),
            length: Number(product.dimensions.length),
            width: Number(product.dimensions.width),
            height: Number(product.dimensions.height),
          }
        : null,
      
      seo: product.seo || null,
      
      images: product.images
        ? product.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            altText: img.altText,
            order: img.order,
            isPrimary: img.isPrimary,
          }))
        : undefined,
      
      category: product.category || null,
      collection: product.collection || null,
      
      variants: product.variants
        ? product.variants.map((v: any) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            sku: v.sku,
            stock: v.stock,
            price: v.priceAdjustment ? Number(v.priceAdjustment) : null,
            comparePrice: null,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
          }))
        : undefined,
    };
  }
}

export const productService = new ProductService();
