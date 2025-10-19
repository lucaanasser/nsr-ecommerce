/**
 * Middleware responsável por autorização baseada em roles de usuário.
 * Permite restringir acesso a rotas por perfil e validar acesso a recursos próprios.
 */
import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth.types';
import { ForbiddenError } from '../utils/errors';
import { logger } from '@config/logger.colored';

/**
 * Middleware de autorização por role
 * Verifica se o usuário autenticado possui uma das roles permitidas
 * 
 * DEVE ser usado APÓS o middleware authenticate
 * 
 * @param allowedRoles - Array de roles permitidas
 * @returns Middleware function
 * 
 * @example
 * router.get('/admin', authenticate, authorize('ADMIN'), controller)
 * router.get('/users', authenticate, authorize('ADMIN', 'CUSTOMER'), controller)
 */
export function authorize(...allowedRoles: UserRole[]) {
  return async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Verifica se usuário está autenticado
      if (!req.user) {
        throw new ForbiddenError('Usuário não autenticado');
      }

      // Verifica se role do usuário está nas roles permitidas
      if (!allowedRoles.includes(req.user.role)) {
        // Log de tentativa de acesso não autorizado
        logger.warn('Unauthorized access attempt', {
          userId: req.user.userId,
          email: req.user.email,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          path: req.path,
          method: req.method,
          ip: req.ip,
        });

        throw new ForbiddenError('Você não tem permissão para acessar este recurso');
      }

      // Usuário autorizado
      logger.info('User authorized', {
        userId: req.user.userId,
        role: req.user.role,
        path: req.path,
        method: req.method,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware de autorização apenas para ADMIN
 * Atalho para authorize('ADMIN')
 */
export const adminOnly = authorize(UserRole.ADMIN);

/**
 * Middleware de autorização apenas para CUSTOMER
 * Atalho para authorize('CUSTOMER')
 */
export const customerOnly = authorize(UserRole.CUSTOMER);

/**
 * Middleware que verifica se usuário está acessando seus próprios recursos
 * Compara req.user.userId com req.params.userId
 * 
 * ADMINs têm acesso a todos os recursos
 * 
 * @example
 * router.get('/users/:userId', authenticate, authorizeOwnerOrAdmin, controller)
 */
export async function authorizeOwnerOrAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Verifica se usuário está autenticado
    if (!req.user) {
      throw new ForbiddenError('Usuário não autenticado');
    }

    const { userId } = req.params;

    // ADMIN tem acesso a tudo
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // Usuário só pode acessar seus próprios recursos
    if (req.user.userId !== userId) {
      logger.warn('User attempted to access another user resource', {
        userId: req.user.userId,
        attemptedUserId: userId,
        path: req.path,
        method: req.method,
      });

      throw new ForbiddenError('Você só pode acessar seus próprios recursos');
    }

    next();
  } catch (error) {
    next(error);
  }
}
