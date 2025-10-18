import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import {
  CreateCollectionDTO,
  UpdateCollectionDTO,
  CollectionResponse,
} from '../types/product.types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../config/logger';

class CollectionService {
  /**
   * Buscar todas as coleções
   */
  async getCollections(): Promise<CollectionResponse[]> {
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    logger.info('Collections fetched', { count: collections.length });

    return collections.map(this.formatCollection);
  }

  /**
   * Buscar coleção por slug
   */
  async getCollectionBySlug(slug: string): Promise<CollectionResponse> {
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!collection) {
      throw new NotFoundError('Coleção não encontrada');
    }

    logger.info('Collection fetched by slug', { slug, collectionId: collection.id });

    return this.formatCollection(collection);
  }

  /**
   * Criar coleção (Admin)
   */
  async createCollection(data: CreateCollectionDTO): Promise<CollectionResponse> {
    // Verificar se slug já existe
    const existingSlug = await prisma.collection.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new ValidationError('Slug já está em uso');
    }

    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.image,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    logger.info('Collection created', { collectionId: collection.id, name: collection.name });

    return this.formatCollection(collection);
  }

  /**
   * Atualizar coleção (Admin)
   */
  async updateCollection(id: string, data: UpdateCollectionDTO): Promise<CollectionResponse> {
    const existing = await prisma.collection.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundError('Coleção não encontrada');
    }

    // Verificar slug único (se estiver sendo alterado)
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.collection.findUnique({
        where: { slug: data.slug },
      });
      if (slugExists) {
        throw new ValidationError('Slug já está em uso');
      }
    }

    const updateData: Prisma.CollectionUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.imageUrl = data.image;

    const collection = await prisma.collection.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    logger.info('Collection updated', { collectionId: id, changes: Object.keys(data) });

    return this.formatCollection(collection);
  }

  /**
   * Deletar coleção (Admin)
   */
  async deleteCollection(id: string): Promise<void> {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!collection) {
      throw new NotFoundError('Coleção não encontrada');
    }

    // Não permitir deletar se tiver produtos
    if (collection._count.products > 0) {
      throw new ValidationError(
        `Não é possível deletar coleção com ${collection._count.products} produto(s) associado(s)`
      );
    }

    await prisma.collection.delete({ where: { id } });

    logger.info('Collection deleted', { collectionId: id, name: collection.name });
  }

  /**
   * Formatar coleção para resposta
   */
  private formatCollection(collection: any): CollectionResponse {
    return {
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.imageUrl,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      _count: collection._count,
    };
  }
}

export const collectionService = new CollectionService();
