import request from 'supertest';
import { app } from '../src/app';
import { createTestCategory, createTestProduct } from './helpers';

describe('Products API (Public)', () => {
  describe('GET /api/v1/products', () => {
    it('should list all active products', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      
      await createTestProduct({
        name: 'Camiseta Básica',
        categoryId: category.id,
        price: 79.99,
      });

      await createTestProduct({
        name: 'Camiseta Premium',
        categoryId: category.id,
        price: 129.99,
      });

      const response = await request(app)
        .get('/api/v1/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBeGreaterThan(0);
      expect(response.body.products[0]).toHaveProperty('id');
      expect(response.body.products[0]).toHaveProperty('name');
      expect(response.body.products[0]).toHaveProperty('slug');
      expect(response.body.products[0]).toHaveProperty('price');
      expect(response.body.products[0]).toHaveProperty('category');
    });

    it('should filter products by category', async () => {
      const category1 = await createTestCategory({ name: 'Camisetas' });
      const category2 = await createTestCategory({ name: 'Calças' });

      await createTestProduct({
        name: 'Camiseta',
        categoryId: category1.id,
      });

      await createTestProduct({
        name: 'Calça',
        categoryId: category2.id,
      });

      const response = await request(app)
        .get(`/api/v1/products?categoryId=${category1.id}`)
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].category.id).toBe(category1.id);
    });

    it('should filter products by price range', async () => {
      const category = await createTestCategory({ name: 'Roupas' });

      await createTestProduct({
        name: 'Produto Barato',
        categoryId: category.id,
        price: 50,
      });

      await createTestProduct({
        name: 'Produto Caro',
        categoryId: category.id,
        price: 500,
      });

      const response = await request(app)
        .get('/api/v1/products?minPrice=40&maxPrice=100')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toBe('Produto Barato');
    });

    it('should filter featured products', async () => {
      const category = await createTestCategory({ name: 'Roupas' });

      await createTestProduct({
        name: 'Produto Normal',
        categoryId: category.id,
        isFeatured: false,
      });

      await createTestProduct({
        name: 'Produto Destaque',
        categoryId: category.id,
        isFeatured: true,
      });

      const response = await request(app)
        .get('/api/v1/products?isFeatured=true')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].isFeatured).toBe(true);
    });

    it('should search products by name', async () => {
      const category = await createTestCategory({ name: 'Roupas' });

      await createTestProduct({
        name: 'Camiseta Azul',
        categoryId: category.id,
      });

      await createTestProduct({
        name: 'Calça Preta',
        categoryId: category.id,
      });

      const response = await request(app)
        .get('/api/v1/products?search=camiseta')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
      expect(response.body.products[0].name).toContain('Camiseta');
    });

    it('should paginate products', async () => {
      const category = await createTestCategory({ name: 'Roupas' });

      // Criar 15 produtos
      for (let i = 1; i <= 15; i++) {
        await createTestProduct({
          name: `Produto ${i}`,
          categoryId: category.id,
        });
      }

      const response = await request(app)
        .get('/api/v1/products?page=1&limit=10')
        .expect(200);

      expect(response.body.products).toHaveLength(10);
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination.total).toBeGreaterThanOrEqual(15);
    });

    it('should return empty array when no products match filters', async () => {
      const response = await request(app)
        .get('/api/v1/products?search=inexistente-xyz-123')
        .expect(200);

      expect(response.body.products).toHaveLength(0);
    });
  });

  describe('GET /api/v1/products/:slug', () => {
    it('should get product details by slug', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Camiseta Especial',
        categoryId: category.id,
        slug: 'camiseta-especial',
      });

      const response = await request(app)
        .get(`/api/v1/products/${product.slug}`)
        .expect(200);

      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe(product.name);
      expect(response.body.slug).toBe(product.slug);
      expect(response.body).toHaveProperty('category');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('images');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/v1/products/produto-inexistente')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should include product variants if available', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Camiseta com Variantes',
        categoryId: category.id,
      });

      const response = await request(app)
        .get(`/api/v1/products/${product.slug}`)
        .expect(200);

      expect(response.body).toHaveProperty('variants');
    });
  });
});
