/**
 * Repositório responsável por todas as operações de banco de dados relacionadas a usuários.
 * Implementa métodos customizados para busca, autenticação e atualização de usuários.
 */
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { prisma } from '../config/database';

type User = Prisma.UserGetPayload<{}>;

/**
 * User Repository
 * Gerencia todas as operações de banco de dados relacionadas a usuários
 */
export class UserRepository extends BaseRepository<User> {
  protected model = prisma.user;

  /**
   * Encontra usuário por email (sem senha)
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        cpf: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        password: false, // Exclui senha por segurança
      },
    }) as Promise<User | null>;
  }

  /**
   * Encontra usuário por email incluindo senha (para autenticação)
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  /**
   * Encontra usuário por CPF
   */
  async findByCpf(cpf: string): Promise<User | null> {
    return this.model.findUnique({
      where: { cpf },
    });
  }

  /**
   * Atualiza senha do usuário
   */
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.model.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  /**
   * Atualiza último login
   */
  async updateLastLogin(id: string): Promise<User> {
    return this.model.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  /**
   * Encontra usuário com tokens de refresh
   */
  async findWithRefreshTokens(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        refreshTokens: {
          where: {
            expiresAt: {
              gte: new Date(), // Apenas tokens válidos
            },
          },
        },
      },
    });
  }

  /**
   * Encontra usuário com endereços
   */
  async findWithAddresses(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        addresses: {
          orderBy: {
            isDefault: 'desc', // Endereço padrão primeiro
          },
        },
      },
    });
  }

  /**
   * Encontra usuário com pedidos
   */
  async findWithOrders(id: string, options?: {
    take?: number;
    skip?: number;
  }) {
    return this.model.findUnique({
      where: { id },
      include: {
        orders: {
          take: options?.take,
          skip: options?.skip,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            items: true,
          },
        },
      },
    });
  }

  /**
   * Cria usuário com validação
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.model.create({
      data,
    });
  }

  /**
   * Lista todos os usuários (admin)
   */
  async findAllUsers(options?: {
    role?: string;
    search?: string;
    take?: number;
    skip?: number;
  }) {
    const where: Prisma.UserWhereInput = {};

    if (options?.role) {
      where.role = options.role as any;
    }

    if (options?.search) {
      where.OR = [
        { firstName: { contains: options.search, mode: 'insensitive' } },
        { lastName: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    return this.model.findMany({
      where,
      take: options?.take,
      skip: options?.skip,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        cpf: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        password: false,
      },
    });
  }

  /**
   * Conta usuários por role
   */
  async countByRole(role?: string): Promise<number> {
    return this.model.count({
      where: role ? { role: role as any } : undefined,
    });
  }
}

// Exporta instância única (Singleton)
export const userRepository = new UserRepository();
