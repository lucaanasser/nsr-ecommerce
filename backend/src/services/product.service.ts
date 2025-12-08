/**
 * Service responsável por toda a lógica de negócio de produtos.
 * Implementa busca, filtros, paginação, criação, atualização e formatação de produtos.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
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
    if (filters.category) where.category = filters.category;
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
      productRepository.count({ where }),
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
    // ⚠️ VALIDAÇÃO CRÍTICA: Produtos featured devem ser active
    if (data.isFeatured && !data.isActive) {
      throw new ValidationError('Produtos em destaque (featured) devem estar ativos (isActive=true)');
    }

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
        category: data.category,
        collectionId: data.collectionId,
        gender: data.gender || 'UNISEX',
        isFeatured: data.isFeatured || false,
        isActive: data.isActive ?? true,
        
        // Criar detalhes do produto
        details: data.details
          ? {
              create: {
                description: data.details.description,
                specifications: data.details.specifications,
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
                colorHex: v.colorHex,
                sku: v.sku,
                stock: v.stock,
                priceAdjustment: v.priceAdjustment ? new Prisma.Decimal(v.priceAdjustment) : null,
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

    // ⚠️ VALIDAÇÃO CRÍTICA: Produtos featured devem ser active
    const willBeFeatured = data.isFeatured !== undefined ? data.isFeatured : existing.isFeatured;
    const willBeActive = data.isActive !== undefined ? data.isActive : existing.isActive;
    
    if (willBeFeatured && !willBeActive) {
      throw new ValidationError('Produtos em destaque (featured) devem estar ativos (isActive=true)');
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
    if (data.category !== undefined) updateData.category = data.category;
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

  /**
   * Obter categorias únicas em uso
   */
  async getCategories(): Promise<string[]> {
    const products = await productRepository.findMany({});
    const categories = new Set<string>();
    
    products.forEach((product: any) => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    
    return Array.from(categories).sort();
  }

  /**
   * Ativar produtos em lote (Admin)
   */
  async bulkActivate(ids: string[]): Promise<{ count: number }> {
    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive: true },
    });

    logger.info('Products bulk activated', { count: result.count, ids });

    return { count: result.count };
  }

  /**
   * Desativar produtos em lote (Admin)
   */
  async bulkDeactivate(ids: string[]): Promise<{ count: number }> {
    // Verificar se algum produto é featured
    const featuredProducts = await productRepository.findMany({
      where: {
        id: { in: ids },
        isFeatured: true,
      },
    });

    if (featuredProducts.length > 0) {
      throw new ValidationError(
        `Não é possível desativar produtos em destaque. Produtos: ${featuredProducts.map((p: any) => p.name).join(', ')}`
      );
    }

    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive: false },
    });

    logger.info('Products bulk deactivated', { count: result.count, ids });

    return { count: result.count };
  }

  /**
   * Deletar produtos em lote (Admin) - Soft delete
   */
  async bulkDelete(ids: string[]): Promise<{ count: number }> {
    // Soft delete - apenas desativa os produtos
    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: {
        isActive: false,
        isFeatured: false, // Remove featured ao deletar
      },
    });

    logger.info('Products bulk deleted (soft)', { count: result.count, ids });

    return { count: result.count };
  }

  /**
   * Duplicar produto (Admin)
   */
  async duplicateProduct(id: string): Promise<ProductResponse> {
    // Buscar produto original com todas as relações
    const original = await prisma.product.findUnique({
      where: { id },
      include: {
        details: true,
        dimensions: true,
        seo: true,
        images: true,
        variants: true,
      },
    });

    if (!original) {
      throw new NotFoundError('Produto não encontrado');
    }

    // Criar novo slug único
    const newSlug = `${original.slug}-copia-${Date.now()}`;

    // Criar cópia do produto
    const duplicate = await prisma.product.create({
      data: {
        name: `${original.name} (Cópia)`,
        slug: newSlug,
        price: original.price,
        comparePrice: original.comparePrice,
        stock: 0, // Cópia começa sem estoque
        sku: null, // SKU deve ser único, deixar null
        category: original.category,
        collectionId: original.collectionId,
        gender: original.gender,
        isFeatured: false, // Cópia não é featured
        isActive: false, // Cópia começa inativa
        
        // Copiar detalhes se existirem
        details: original.details
          ? {
              create: {
                description: original.details.description,
                specifications: original.details.specifications,
              },
            }
          : undefined,
        
        // Copiar dimensões se existirem
        dimensions: original.dimensions
          ? {
              create: {
                weight: original.dimensions.weight,
                length: original.dimensions.length,
                width: original.dimensions.width,
                height: original.dimensions.height,
              },
            }
          : undefined,
        
        // Copiar SEO se existir
        seo: original.seo
          ? {
              create: {
                metaTitle: original.seo.metaTitle,
                metaDescription: original.seo.metaDescription,
                keywords: original.seo.keywords,
              },
            }
          : undefined,
      },
      include: {
        collection: true,
        details: true,
        dimensions: true,
        seo: true,
        images: true,
        variants: true,
      },
    });

    logger.info('Product duplicated', {
      originalId: id,
      duplicateId: duplicate.id,
    });

    return this.formatProduct(duplicate);
  }
}

export const productService = new ProductService();
