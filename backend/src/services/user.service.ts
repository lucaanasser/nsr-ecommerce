import { prisma } from '@config/database';
import { UserRole } from '@prisma/client';

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}

export class UserService {
  /**
   * Listar usuários com filtros e paginação
   */
  async getUsers(filters: UserFilters) {
    const { search, role, status, page = 1, limit = 10 } = filters;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    // Status logic (active/inactive based on deletion/anonymization)
    if (status === 'active') {
      where.anonymizedAt = null;
      where.deletionRequestedAt = null;
    } else if (status === 'inactive') {
      where.OR = [
        { NOT: { anonymizedAt: null } },
        { NOT: { deletionRequestedAt: null } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          lastLogin: true,
          anonymizedAt: true,
          deletionRequestedAt: true,
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where })
    ]);

    return {
      data: users.map(user => ({
        ...user,
        status: (user.anonymizedAt || user.deletionRequestedAt) ? 'inactive' : 'active',
        ordersCount: user._count.orders
      })),
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Obter detalhes do usuário
   */
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!user) return null;

    return {
      ...user,
      status: (user.anonymizedAt || user.deletionRequestedAt) ? 'inactive' : 'active',
      ordersCount: user._count.orders
    };
  }
}
