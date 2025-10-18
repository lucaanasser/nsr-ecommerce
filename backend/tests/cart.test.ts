import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/config/database';
import { createTestUser, createTestProduct, cleanDatabase } from './helpers';

/**
 * Cart API Tests
 * Testa endpoints de carrinho de compras
 */

describe('Cart API', () => {
  let authToken: string;
  let userId: string;
  let productId: string;

  beforeAll(async () => {
    // Limpar banco de dados
    await cleanDatabase();

    // Criar usuário de teste
    const testUser = await createTestUser('CUSTOMER', {
      email: 'cart@test.com',
      name: 'Cart User',
    });
    userId = testUser.user.id;
    authToken = testUser.accessToken; // Usar token do helper

    // Criar produto de teste
    const product = await createTestProduct({
      name: 'Produto Teste Carrinho',
      price: 99.90,
      stock: 10,
      isActive: true,
    });
    productId = product.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  // ================================
  // GET /api/v1/cart
  // ================================

  describe('GET /api/v1/cart', () => {
    it('should return empty cart for new user', async () => {
      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('userId', userId);
      expect(res.body.items).toEqual([]);
      expect(res.body.summary.subtotal).toBe(0);
      expect(res.body.summary.itemCount).toBe(0);
      expect(res.body.summary.totalQuantity).toBe(0);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/v1/cart');

      expect(res.status).toBe(401);
    });
  });

  // ================================
  // POST /api/v1/cart/items
  // ================================

  describe('POST /api/v1/cart/items', () => {
    it('should add item to cart with valid data', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          size: 'M',
          color: 'Preto',
          quantity: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body.cart.items).toHaveLength(1);
      expect(res.body.cart.items[0].quantity).toBe(2);
      expect(res.body.cart.summary.subtotal).toBe(99.90 * 2);
    });

    it('should increment quantity if item already exists (same variant)', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          size: 'M',
          color: 'Preto',
          quantity: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.cart.items).toHaveLength(1);
      expect(res.body.cart.items[0].quantity).toBe(3); // 2 + 1
      expect(res.body.cart.summary.subtotal).toBe(99.90 * 3);
    });

    it('should add separate item for different variant', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          size: 'G',
          color: 'Preto',
          quantity: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.cart.items).toHaveLength(2); // Agora tem 2 itens diferentes
    });

    it('should return 404 if product not found', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: '123e4567-e89b-12d3-a456-426614174000',
          size: 'M',
          color: 'Preto',
          quantity: 1,
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('não encontrado');
    });

    it('should return 400 if product is inactive', async () => {
      // Criar produto inativo
      const inactiveProduct = await createTestProduct({
        name: 'Produto Inativo',
        price: 50,
        stock: 10,
        isActive: false,
      });

      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: inactiveProduct.id,
          size: 'M',
          color: 'Azul',
          quantity: 1,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('não está mais disponível');
    });

    it('should return 400 if insufficient stock', async () => {
      // Criar produto com pouco estoque
      const lowStockProduct = await createTestProduct({
        name: 'Produto Pouco Estoque',
        price: 50,
        stock: 2,
        isActive: true,
      });

      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: lowStockProduct.id,
          size: 'M',
          color: 'Verde',
          quantity: 5, // Mais que o estoque
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Estoque insuficiente');
    });

    it('should return 422 for invalid quantity (0)', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          size: 'M',
          color: 'Preto',
          quantity: 0,
        });

      expect(res.status).toBe(422);
    });

    it('should return 422 for invalid quantity (11)', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          size: 'M',
          color: 'Preto',
          quantity: 11,
        });

      expect(res.status).toBe(422);
      expect(res.body.message).toContain('máxima é 10');
    });

    it('should return 422 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          // size e color faltando
          quantity: 1,
        });

      expect(res.status).toBe(422);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .send({
          productId,
          size: 'M',
          color: 'Preto',
          quantity: 1,
        });

      expect(res.status).toBe(401);
    });
  });

  // ================================
  // PUT /api/v1/cart/items/:id
  // ================================

  describe('PUT /api/v1/cart/items/:id', () => {
    let testItemId: string;

    beforeEach(async () => {
      // Limpar carrinho antes
      await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      // Adicionar item fresco para cada teste
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          size: 'M',
          color: 'Preto',
          quantity: 2,
        });
      
      if (res.body.cart && res.body.cart.items && res.body.cart.items.length > 0) {
        testItemId = res.body.cart.items[0].id;
      }
    });

    it('should update item quantity', async () => {
      const res = await request(app)
        .put(`/api/v1/cart/items/${testItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 5,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');

      const item = res.body.cart.items.find((i: any) => i.id === testItemId);
      expect(item.quantity).toBe(5);
    });

    it('should return 404 if item not found', async () => {
      const res = await request(app)
        .put('/api/v1/cart/items/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 2,
        });

      expect(res.status).toBe(404);
    });

    it('should return 400 if insufficient stock', async () => {
      const res = await request(app)
        .put(`/api/v1/cart/items/${testItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 99, // Mais que o estoque (10)
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Estoque insuficiente');
    });

    it('should return 422 for invalid quantity', async () => {
      const res = await request(app)
        .put(`/api/v1/cart/items/${testItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 0,
        });

      expect(res.status).toBe(422);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .put(`/api/v1/cart/items/${testItemId}`)
        .send({
          quantity: 2,
        });

      expect(res.status).toBe(401);
    });
  });

  // ================================
  // DELETE /api/v1/cart/items/:id
  // ================================

  describe('DELETE /api/v1/cart/items/:id', () => {
    let testItemId: string;

    beforeEach(async () => {
      // Limpar carrinho antes
      await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      // Adicionar item fresco para cada teste
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          size: 'M',
          color: 'Preto',
          quantity: 2,
        });
      
      if (res.body.cart && res.body.cart.items && res.body.cart.items.length > 0) {
        testItemId = res.body.cart.items[0].id;
      }
    });

    it('should remove item from cart', async () => {
      const res = await request(app)
        .delete(`/api/v1/cart/items/${testItemId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');

      // Verificar que item foi removido
      const cartRes = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      const item = cartRes.body.items.find((i: any) => i.id === testItemId);
      expect(item).toBeUndefined();
    });

    it('should return 404 if item not found', async () => {
      const res = await request(app)
        .delete('/api/v1/cart/items/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    it('should require authentication', async () => {
      const res = await request(app).delete(`/api/v1/cart/items/${testItemId}`);

      expect(res.status).toBe(401);
    });
  });

  // ================================
  // DELETE /api/v1/cart
  // ================================

  describe('DELETE /api/v1/cart', () => {
    beforeEach(async () => {
      // Adicionar alguns itens antes de limpar
      await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          size: 'M',
          color: 'Preto',
          quantity: 2,
        });
    });

    it('should clear all items from cart', async () => {
      const res = await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');

      // Verificar que carrinho está vazio
      const cartRes = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(cartRes.body.items).toHaveLength(0);
      expect(cartRes.body.summary.subtotal).toBe(0);
    });

    it('should return success even if cart already empty', async () => {
      // Limpar primeiro
      await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      // Limpar novamente
      const res = await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
    });

    it('should require authentication', async () => {
      const res = await request(app).delete('/api/v1/cart');

      expect(res.status).toBe(401);
    });
  });
});
