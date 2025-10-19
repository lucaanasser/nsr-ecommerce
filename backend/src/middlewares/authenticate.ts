/**
 * Middleware responsável por autenticar requisições usando JWT.
 * Injeta dados do usuário autenticado em req.user e suporta modo obrigatório e opcional.
 */
import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyAccessToken } from '../utils/jwt';
import { logger } from '@config/logger.colored';

/**
 * Middleware de autenticação
 * Extrai e valida JWT do header Authorization
 * Injeta dados do usuário em req.user
 * 
 * @throws UnauthorizedError se token inválido ou ausente
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extrai token do header Authorization
    const token = extractTokenFromHeader(req.headers.authorization);

    // Verifica e decodifica token
    const payload = verifyAccessToken(token);

    // Injeta dados do usuário no request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as any,
    };

    // Log de acesso (sem dados sensíveis)
    logger.info('User authenticated', {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      path: req.path,
      method: req.method,
    });

    next();
  } catch (error) {
    // Log de falha de autenticação
    logger.warn('Authentication failed', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Passa erro para error handler
    next(error);
  }
}

/**
 * Middleware de autenticação opcional
 * Tenta autenticar, mas não falha se token ausente
 * Útil para rotas que funcionam com ou sem autenticação
 */
export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Se não houver header Authorization, continua sem autenticar
    if (!req.headers.authorization) {
      return next();
    }

    // Extrai token do header Authorization
    const token = extractTokenFromHeader(req.headers.authorization);

    // Verifica e decodifica token
    const payload = verifyAccessToken(token);

    // Injeta dados do usuário no request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as any,
    };

    next();
  } catch (error) {
    // Em caso de erro, apenas loga mas não interrompe
    logger.debug('Optional authentication failed', {
      path: req.path,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Continua sem autenticação
    next();
  }
}
