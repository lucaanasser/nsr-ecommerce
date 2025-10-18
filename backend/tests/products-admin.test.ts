import request from 'supertest';
import { app } from '../src/app';
import { createTestAdmin, createTestCustomer, createTestCategory, createTestProduct } from './helpers';

describe('Products API (Admin)', () => {
  describe('POST /api/v1/admin/products', () => {
    it('should create product as admin', async () => {
      const { accessToken } = await createTestAdmin();
      const category = await createTestCategory({ name: 'Camisetas' });

      const productData = {
        name: 'Nova Camiseta',
        slug: 'nova-camiseta',
        description: 'Descrição da camiseta',
        price: 99.99,
        categoryId: category.id,
        gender: 'UNISEX',
        stock: 50,
        isFeatured: true,
      };

      const response = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
      expect(response.body.price).toBe(productData.price);
      expect(response.body.isFeatured).toBe(true);
    });

    it('should reject product creation without authentication', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });

      const productData = {
        name: 'Nova Camiseta',
        price: 99.99,
        categoryId: category.id,
      };

      const response = await request(app)
        .post('/api/v1/admin/products')
        .send(productData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject product creation as customer (not admin)', async () => {
      const { accessToken } = await createTestCustomer();
      const category = await createTestCategory({ name: 'Camisetas' });

      const productData = {
        name: 'Nova Camiseta',
        price: 99.99,
        categoryId: category.id,
      };

      const response = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(productData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject product creation with invalid data', async () => {
      const { accessToken } = await createTestAdmin();

      const invalidData = {
        name: '', // Nome vazio
        price: -10, // Preço negativo
      };

      const response = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject product creation with duplicate slug', async () => {
      const { accessToken } = await createTestAdmin();
      const category = await createTestCategory({ name: 'Camisetas' });

      // Criar primeiro produto
      await createTestProduct({
        name: 'Produto 1',
        categoryId: category.id,
        slug: 'produto-duplicado',
      });

      // Tentar criar segundo produto com mesmo slug
      const productData = {
        name: 'Produto 2',
        slug: 'produto-duplicado',
        price: 99.99,
        categoryId: category.id,
      };

      const response = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(productData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/admin/products/:id', () => {
    it('should update product as admin', async () => {
      const { accessToken } = await createTestAdmin();
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Produto Original',
        categoryId: category.id,
      });

      const updateData = {
        name: 'Produto Atualizado',
        price: 149.99,
        isFeatured: true,
      };

      const response = await request(app)
        .put(`/api/v1/admin/products/${product.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.isFeatured).toBe(true);
    });

    it('should reject update without authentication', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Produto',
        categoryId: category.id,
      });

      const response = await request(app)
        .put(`/api/v1/admin/products/${product.id}`)
        .send({ name: 'Novo Nome' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject update as customer (not admin)', async () => {
      const { accessToken } = await createTestCustomer();
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Produto',
        categoryId: category.id,
      });

      const response = await request(app)
        .put(`/api/v1/admin/products/${product.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Novo Nome' })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent product', async () => {
      const { accessToken } = await createTestAdmin();

      const response = await request(app)
        .put('/api/v1/admin/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Novo Nome' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject update with invalid data', async () => {
      const { accessToken } = await createTestAdmin();
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Produto',
        categoryId: category.id,
      });

      const response = await request(app)
        .put(`/api/v1/admin/products/${product.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ price: -100 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/v1/admin/products/:id', () => {
    it('should delete (soft delete) product as admin', async () => {
      const { accessToken } = await createTestAdmin();
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Produto para Deletar',
        categoryId: category.id,
      });

      const response = await request(app)
        .delete(`/api/v1/admin/products/${product.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');

      // Verificar se produto foi soft deleted (isActive = false)
      const deletedProduct = await request(app)
        .get(`/api/v1/products/${product.slug}`)
        .expect(404);

      expect(deletedProduct.body).toHaveProperty('error');
    });

    it('should reject delete without authentication', async () => {
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Produto',
        categoryId: category.id,
      });

      const response = await request(app)
        .delete(`/api/v1/admin/products/${product.id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject delete as customer (not admin)', async () => {
      const { accessToken } = await createTestCustomer();
      const category = await createTestCategory({ name: 'Camisetas' });
      const product = await createTestProduct({
        name: 'Produto',
        categoryId: category.id,
      });

      const response = await request(app)
        .delete(`/api/v1/admin/products/${product.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent product', async () => {
      const { accessToken } = await createTestAdmin();

      const response = await request(app)
        .delete('/api/v1/admin/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});
