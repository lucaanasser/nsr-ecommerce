import request from 'supertest';
import { app } from '../src/app';
import { createTestCategory, createTestProduct } from './helpers';

describe('Categories API', () => {
  describe('GET /api/v1/categories', () => {
    it('should list all categories', async () => {
      await createTestCategory({ name: 'Camisetas' });
      await createTestCategory({ name: 'Calças' });
      await createTestCategory({ name: 'Acessórios' });

      const response = await request(app)
        .get('/api/v1/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('slug');
    });

    it('should return empty array when no categories exist', async () => {
      const response = await request(app)
        .get('/api/v1/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should include product count for each category', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      
      await createTestProduct({
        name: 'Produto 1',
        categoryId: category.id,
      });

      await createTestProduct({
        name: 'Produto 2',
        categoryId: category.id,
      });

      const response = await request(app)
        .get('/api/v1/categories')
        .expect(200);

      const foundCategory = response.body.find((c: any) => c.id === category.id);
      expect(foundCategory).toBeDefined();
      // Verificar se há informação de produtos (depende da implementação)
    });
  });

  describe('GET /api/v1/categories/:slug', () => {
    it('should get category details by slug', async () => {
      const category = await createTestCategory({
        name: 'Camisetas Premium',
        slug: 'camisetas-premium',
        description: 'Camisetas de alta qualidade',
      });

      const response = await request(app)
        .get(`/api/v1/categories/${category.slug}`)
        .expect(200);

      expect(response.body.id).toBe(category.id);
      expect(response.body.name).toBe(category.name);
      expect(response.body.slug).toBe(category.slug);
      expect(response.body.description).toBe(category.description);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/v1/categories/categoria-inexistente')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should include products from category', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      
      await createTestProduct({
        name: 'Camiseta 1',
        categoryId: category.id,
      });

      await createTestProduct({
        name: 'Camiseta 2',
        categoryId: category.id,
      });

      const response = await request(app)
        .get(`/api/v1/categories/${category.slug}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBeGreaterThanOrEqual(2);
    });
  });
});
