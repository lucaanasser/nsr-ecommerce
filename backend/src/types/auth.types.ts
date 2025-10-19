/**
 * Tipos e interfaces para autenticação, sessão e usuários no sistema.
 * Inclui DTOs, payloads de JWT, respostas e extensão do Request.
 */
import { Request } from 'express';
import { UserRole } from '@prisma/client';

/**
 * Dados do usuário autenticado (injetado no request)
 */
export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Estende Request do Express com usuário autenticado
 */
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

/**
 * DTO para registro de usuário
 */
export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  cpf?: string;
  phone?: string;
  // LGPD - Consentimentos
  privacyPolicy?: boolean;
  terms?: boolean;
  marketing?: boolean;
}

/**
 * DTO para login
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * DTO para refresh token
 */
export interface RefreshTokenDTO {
  refreshToken: string;
}

/**
 * DTO para atualização de perfil
 */
export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  cpf?: string;
}

/**
 * DTO para mudança de senha
 */
export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

/**
 * Resposta de login com tokens
 */
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone: string | null;
    cpf: string | null;
    createdAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Par de tokens (access + refresh)
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Payload do JWT
 * Já definido em utils/jwt.ts, re-exportando para conveniência
 */
export { JWTPayload } from '../utils/jwt';

/**
 * Resposta padrão de usuário (sem senha)
 */
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  cpf: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

/**
 * Opções para geração de tokens
 */
export interface TokenOptions {
  expiresIn?: string;
  audience?: string;
  issuer?: string;
}
