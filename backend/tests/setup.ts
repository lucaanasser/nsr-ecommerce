import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Setup global para os testes
 * Executado antes de todos os testes
 */
beforeAll(async () => {
  // Limpar banco de dados antes de executar testes
  await cleanDatabase();
});

/**
 * Cleanup após cada teste
 */
afterEach(async () => {
  // Limpar dados após cada teste para garantir isolamento
  await cleanDatabase();
});

/**
 * Cleanup global após todos os testes
 */
afterAll(async () => {
  await prisma.$disconnect();
});

/**
 * Limpa todas as tabelas do banco de dados
 */
async function cleanDatabase() {
  const tables = [
    'refresh_tokens',
    'order_items',
    'orders',
    'cart_items',
    'carts',
    'product_variants',
    'products',
    'collections',
    'categories',
    'addresses',
    'reviews',
    'users',
  ];

  // Limpar cada tabela (PostgreSQL)
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    } catch (error) {
      // Ignorar erros se a tabela não existir
      console.warn(`Aviso: Não foi possível limpar a tabela ${table}`);
    }
  }
}

export { prisma };
