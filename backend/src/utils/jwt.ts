/**
 * Utilitários para geração, verificação e manipulação de JWT (access/refresh) na autenticação da API.
 * Inclui helpers para extração, validação, renovação e decodificação de tokens.
 */
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UnauthorizedError } from './errors';

/**
 * Payload do JWT
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  exp?: number; // Tempo de expiração (Unix timestamp)
  iat?: number; // Emitido em (Unix timestamp)
  iss?: string; // Issuer
  aud?: string; // Audience
}

/**
 * Configurações padrão do JWT
 */
const JWT_ISSUER = 'nsr-ecommerce';
const JWT_AUDIENCE = 'nsr-api';

/**
 * Gera Access Token (curta duração)
 * @param payload - Dados do usuário
 * @returns Access token JWT
 */
export function generateAccessToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  const jwtPayload: Omit<JWTPayload, 'type'> & { type: 'access' } = {
    ...payload,
    type: 'access',
  };

  const options: jwt.SignOptions = {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  };

  return jwt.sign(jwtPayload, config.jwt.secret, options);
}

/**
 * Gera Refresh Token (longa duração)
 * @param payload - Dados do usuário
 * @returns Refresh token JWT
 */
export function generateRefreshToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  const jwtPayload: Omit<JWTPayload, 'type'> & { type: 'refresh' } = {
    ...payload,
    type: 'refresh',
  };

  const options: jwt.SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  };

  return jwt.sign(jwtPayload, config.jwt.refreshSecret, options);
}

/**
 * Verifica e decodifica Access Token
 * @param token - JWT string
 * @returns Payload decodificado
 * @throws UnauthorizedError se token inválido
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, config.jwt.secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as JWTPayload;

    // Valida tipo do token
    if (decoded.type !== 'access') {
      throw new UnauthorizedError('Token inválido: tipo incorreto');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Token inválido');
    }
    throw error;
  }
}

/**
 * Verifica e decodifica Refresh Token
 * @param token - JWT string
 * @returns Payload decodificado
 * @throws UnauthorizedError se token inválido
 */
export function verifyRefreshToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as JWTPayload;

    // Valida tipo do token
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedError('Token inválido: tipo incorreto');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Refresh token inválido');
    }
    throw error;
  }
}

/**
 * Decodifica token sem verificar assinatura (use com cuidado!)
 * Útil para debug ou extrair informações não-sensíveis
 * @param token - JWT string
 * @returns Payload decodificado ou null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Extrai token do header Authorization
 * @param authHeader - Header Authorization
 * @returns Token extraído
 * @throws UnauthorizedError se formato inválido
 */
export function extractTokenFromHeader(authHeader?: string): string {
  if (!authHeader) {
    throw new UnauthorizedError('Token não fornecido');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    throw new UnauthorizedError('Formato de token inválido');
  }

  const [scheme, token] = parts;

  if (scheme !== 'Bearer') {
    throw new UnauthorizedError('Esquema de autenticação inválido. Use Bearer');
  }

  if (!token) {
    throw new UnauthorizedError('Token não fornecido');
  }

  return token;
}

/**
 * Gera par de tokens (access + refresh)
 * @param payload - Dados do usuário
 * @returns Objeto com ambos os tokens
 */
export function generateTokenPair(payload: {
  userId: string;
  email: string;
  role: string;
}): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verifica se token está próximo de expirar
 * @param token - JWT string
 * @param thresholdSeconds - Segundos antes da expiração (padrão: 60)
 * @returns true se deve renovar token
 */
export function shouldRefreshToken(
  token: string,
  thresholdSeconds = 60
): boolean {
  try {
    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;

    return timeUntilExpiry < thresholdSeconds;
  } catch {
    return true;
  }
}

/**
 * Calcula tempo restante até expiração
 * @param token - JWT string
 * @returns Segundos até expirar ou null se inválido
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - now);
  } catch {
    return null;
  }
}

/**
 * Mascara token para logging (mostra apenas últimos 4 caracteres)
 * NUNCA logue tokens completos!
 * @param token - Token completo
 * @returns Token mascarado
 */
export function maskToken(token: string): string {
  if (token.length <= 4) {
    return '****';
  }
  return `****${token.slice(-4)}`;
}
