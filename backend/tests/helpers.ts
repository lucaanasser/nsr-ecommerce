import { PrismaClient, User, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../src/utils/jwt';

const prisma = new PrismaClient();

/**
 * Interface para dados de usuário de teste
 */
export interface TestUser {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Cria um usuário de teste no banco de dados
 * @param role - Role do usuário (padrão: CUSTOMER)
 * @param userData - Dados adicionais do usuário
 * @returns Usuário criado com tokens
 */
export async function createTestUser(
  role: UserRole = 'CUSTOMER',
  userData: Partial<User> = {}
): Promise<TestUser> {
  const timestamp = Date.now();
  const hashedPassword = await bcrypt.hash('Test@123456', 10);

  const user = await prisma.user.create({
    data: {
      email: userData.email || `test-${role.toLowerCase()}-${timestamp}@test.com`,
      password: hashedPassword,
      name: userData.name || `Test ${role} User`,
      role,
      cpf: userData.cpf || generateCPF(),
      phone: userData.phone || '11999999999',
    },
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Salvar refresh token no banco
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    },
  });

  return { user, accessToken, refreshToken };
}

/**
 * Cria um usuário admin de teste
 * @returns Usuário admin com tokens
 */
export async function createTestAdmin(): Promise<TestUser> {
  return createTestUser('ADMIN', {
    name: 'Admin User',
  });
}

/**
 * Cria um usuário customer de teste
 * @returns Usuário customer com tokens
 */
export async function createTestCustomer(): Promise<TestUser> {
  return createTestUser('CUSTOMER', {
    name: 'Customer User',
  });
}

/**
 * Gera um CPF válido aleatório (apenas para testes)
 * @returns CPF no formato 000.000.000-00
 */
function generateCPF(): string {
  const num1 = Math.floor(Math.random() * 999) + 1;
  const num2 = Math.floor(Math.random() * 999) + 1;
  const num3 = Math.floor(Math.random() * 999) + 1;
  const num4 = Math.floor(Math.random() * 99) + 1;

  return `${num1.toString().padStart(3, '0')}.${num2.toString().padStart(3, '0')}.${num3.toString().padStart(3, '0')}-${num4.toString().padStart(2, '0')}`;
}

/**
 * Cria uma categoria de teste
 */
export async function createTestCategory(data: {
  name: string;
  slug?: string;
  description?: string;
}) {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description || `Descrição de ${data.name}`,
    },
  });
}

/**
 * Cria uma coleção de teste
 */
export async function createTestCollection(data: {
  name: string;
  slug?: string;
  description?: string;
}) {
  return prisma.collection.create({
    data: {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description || `Descrição de ${data.name}`,
    },
  });
}

/**
 * Cria um produto de teste
 */
export async function createTestProduct(data: {
  name: string;
  categoryId: string;
  price?: number;
  slug?: string;
  description?: string;
  isFeatured?: boolean;
}) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description || `Descrição de ${data.name}`,
      price: data.price || 99.99,
      categoryId: data.categoryId,
      isActive: true,
      isFeatured: data.isFeatured ?? false,
      gender: 'UNISEX',
      images: ['https://via.placeholder.com/600x800'],
    },
    include: {
      category: true,
    },
  });
}

/**
 * Limpa o banco de dados (útil para testes específicos)
 */
export async function cleanDatabase() {
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

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    } catch (error) {
      // Ignorar erros
    }
  }
}

export { prisma };
