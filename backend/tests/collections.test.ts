import request from 'supertest';
import { app } from '../src/app';
import { createTestCategory, createTestCollection, createTestProduct, prisma } from './helpers';

describe('Collections API', () => {
  describe('GET /api/v1/collections', () => {
    it('should list all collections', async () => {
      await createTestCollection({ name: 'Verão 2025' });
      await createTestCollection({ name: 'Inverno 2025' });
      await createTestCollection({ name: 'Primavera 2025' });

      const response = await request(app)
        .get('/api/v1/collections')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('slug');
    });

    it('should return empty array when no collections exist', async () => {
      const response = await request(app)
        .get('/api/v1/collections')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should include product count for each collection', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      const collection = await createTestCollection({ name: 'Verão 2025' });

      const product = await createTestProduct({
        name: 'Produto Verão',
        categoryId: category.id,
      });

      // Associar produto à coleção
      await prisma.product.update({
        where: { id: product.id },
        data: { collectionId: collection.id },
      });

      const response = await request(app)
        .get('/api/v1/collections')
        .expect(200);

      const foundCollection = response.body.find((c: any) => c.id === collection.id);
      expect(foundCollection).toBeDefined();
    });
  });

  describe('GET /api/v1/collections/:slug', () => {
    it('should get collection details by slug', async () => {
      const collection = await createTestCollection({
        name: 'Coleção Especial',
        slug: 'colecao-especial',
        description: 'Nossa coleção mais especial',
      });

      const response = await request(app)
        .get(`/api/v1/collections/${collection.slug}`)
        .expect(200);

      expect(response.body.id).toBe(collection.id);
      expect(response.body.name).toBe(collection.name);
      expect(response.body.slug).toBe(collection.slug);
      expect(response.body.description).toBe(collection.description);
    });

    it('should return 404 for non-existent collection', async () => {
      const response = await request(app)
        .get('/api/v1/collections/colecao-inexistente')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should include products from collection', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      const collection = await createTestCollection({ name: 'Verão 2025' });

      const product1 = await createTestProduct({
        name: 'Produto Verão 1',
        categoryId: category.id,
      });

      const product2 = await createTestProduct({
        name: 'Produto Verão 2',
        categoryId: category.id,
      });

      // Associar produtos à coleção
      await prisma.product.update({
        where: { id: product1.id },
        data: { collectionId: collection.id },
      });

      await prisma.product.update({
        where: { id: product2.id },
        data: { collectionId: collection.id },
      });

      const response = await request(app)
        .get(`/api/v1/collections/${collection.slug}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle collections with date ranges', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-03-31');

      const collection = await prisma.collection.create({
        data: {
          name: 'Coleção Limitada',
          slug: 'colecao-limitada',
          description: 'Disponível por tempo limitado',
          startDate,
          endDate,
        },
      });

      const response = await request(app)
        .get(`/api/v1/collections/${collection.slug}`)
        .expect(200);

      expect(response.body.id).toBe(collection.id);
      expect(response.body).toHaveProperty('startDate');
      expect(response.body).toHaveProperty('endDate');
    });
  });
});
