import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryResponse,
} from '../types/product.types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../config/logger';

class CategoryService {
  /**
   * Buscar todas as categorias
   */
  async getCategories(): Promise<CategoryResponse[]> {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    logger.info('Categories fetched', { count: categories.length });

    return categories.map(this.formatCategory);
  }

  /**
   * Buscar categoria por slug
   */
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    logger.info('Category fetched by slug', { slug, categoryId: category.id });

    return this.formatCategory(category);
  }

  /**
   * Criar categoria (Admin)
   */
  async createCategory(data: CreateCategoryDTO): Promise<CategoryResponse> {
    // Verificar se slug já existe
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new ValidationError('Slug já está em uso');
    }

    const category = await prisma.category.create({
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

    logger.info('Category created', { categoryId: category.id, name: category.name });

    return this.formatCategory(category);
  }

  /**
   * Atualizar categoria (Admin)
   */
  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<CategoryResponse> {
    const existing = await prisma.category.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundError('Categoria não encontrada');
    }

    // Verificar slug único (se estiver sendo alterado)
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: data.slug },
      });
      if (slugExists) {
        throw new ValidationError('Slug já está em uso');
      }
    }

    const updateData: Prisma.CategoryUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.imageUrl = data.image;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    logger.info('Category updated', { categoryId: id, changes: Object.keys(data) });

    return this.formatCategory(category);
  }

  /**
   * Deletar categoria (Admin)
   */
  async deleteCategory(id: string): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    // Não permitir deletar se tiver produtos
    if (category._count && category._count.products > 0) {
      throw new ValidationError(
        `Não é possível deletar categoria com ${category._count.products} produto(s) associado(s)`
      );
    }

    await prisma.category.delete({ where: { id } });

    logger.info('Category deleted', { categoryId: id, name: category.name });
  }

  /**
   * Formatar categoria para resposta
   */
  private formatCategory(category: any): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.imageUrl,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      _count: category._count,
    };
  }
}

export const categoryService = new CategoryService();
