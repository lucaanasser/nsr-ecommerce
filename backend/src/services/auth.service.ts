/**
 * Service responsável por toda a lógica de negócio relacionada à autenticação de usuários.
 * Implementa registro, login, refresh, logout, atualização de perfil e LGPD.
 */
import { userRepository } from '../repositories/user.repository';
import { 
  RegisterDTO, 
  LoginResponse, 
  TokenPair, 
  UpdateProfileDTO,
  UserResponse 
} from '../types/auth.types';
import { 
  hashPassword, 
  comparePassword, 
  validatePasswordStrength 
} from '../utils/password';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { 
  ConflictError, 
  UnauthorizedError, 
  NotFoundError,
  ValidationError 
} from '../utils/errors';
import { prisma } from '../config/database';
import { logger } from '@config/logger.colored';
import { emailService } from './email.service';
import { consentService } from './consent.service';

/**
 * Auth Service
 * Contém toda a lógica de negócio relacionada à autenticação
 */
export class AuthService {
  /**
   * Registra novo usuário
   * @param data - Dados do registro
   * @returns Dados do usuário criado (sem senha)
   */
  async register(data: RegisterDTO): Promise<UserResponse> {
    // Valida força da senha
    const passwordValidation = validatePasswordStrength(data.password);

    if (!passwordValidation.isValid) {
      throw new ValidationError(
        'Senha não atende aos requisitos de segurança',
        { errors: passwordValidation.errors }
      );
    }

    // Verifica se email já existe
    const existingUserByEmail = await userRepository.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new ConflictError('Email já cadastrado');
    }

    // Verifica se CPF já existe (se fornecido)
    if (data.cpf) {
      const existingUserByCpf = await userRepository.findByCpf(data.cpf);
      if (existingUserByCpf) {
        throw new ConflictError('CPF já cadastrado');
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Cria usuário
    const user = await userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      cpf: data.cpf,
      birthDate: data.birthDate,
      role: 'CUSTOMER', // Todos começam como CUSTOMER
    });

    // Salva consentimentos no histórico
    await consentService.saveConsents({
      userId: user.id,
      privacyPolicy: data.privacyPolicy,
      terms: data.terms,
      marketing: data.marketing,
      ipAddress: undefined, // Pode ser passado do controller se disponível
      userAgent: undefined, // Pode ser passado do controller se disponível
    });

    logger.info('User registered', {
      userId: user.id,
      email: user.email,
    });

    // Enviar email de boas-vindas (não bloqueia o registro se falhar)
    logger.info('Attempting to send welcome email', {
      userName: user.firstName,
      userEmail: user.email,
    });
    
    emailService
      .sendWelcomeEmail({
        userName: user.firstName,
        userEmail: user.email,
      })
      .then((result) => {
        if (result.success) {
          logger.info('Welcome email sent successfully', {
            userId: user.id,
            email: user.email,
            messageId: result.messageId,
          });
        } else {
          logger.error('Failed to send welcome email', {
            userId: user.id,
            email: user.email,
            error: result.error,
            fullResult: JSON.stringify(result),
          });
        }
      })
      .catch((error) => {
        logger.error('Failed to send welcome email - exception caught', {
          userId: user.id,
          error: error.message || error,
          errorName: error.name,
          stack: error.stack,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        });
      });

    // Retorna usuário sem senha
    return this.sanitizeUser(user);
  }

  /**
   * Autentica usuário e gera tokens
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Dados do usuário e tokens
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Busca usuário por email (COM senha)
    const user = await userRepository.findByEmailWithPassword(email);

    // Se usuário não existe, retorna erro genérico (segurança)
    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    // Compara senha
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      logger.warn('Login attempt with wrong password', {
        userId: user.id,
        email: user.email,
      });
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    // Gera tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Limpa tokens antigos deste usuário antes de criar novo
    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Salva novo refresh token no banco
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    });

    // Atualiza último login
    await userRepository.updateLastLogin(user.id);

    logger.info('User logged in', {
      userId: user.id,
      email: user.email,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Renova tokens usando refresh token
   * Implementa refresh token rotation (token antigo é invalidado)
   * @param refreshToken - Refresh token atual
   * @returns Novos tokens
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verifica assinatura e expiração do refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Busca refresh token no banco
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    // Se token não existe no banco, pode ser tentativa de reutilização
    if (!storedToken) {
      logger.error('Refresh token reuse detected', {
        userId: payload.userId,
      });

      // Invalida TODOS os refresh tokens do usuário (segurança)
      await prisma.refreshToken.deleteMany({
        where: { userId: payload.userId },
      });

      throw new UnauthorizedError('Refresh token inválido ou já utilizado');
    }

    // Verifica se token expirou (double check)
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedError('Refresh token expirado');
    }

    // ROTATION: Invalida token antigo
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Gera novos tokens
    const tokens = generateTokenPair({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // Salva novo refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    });

    logger.info('Tokens refreshed', {
      userId: storedToken.user.id,
    });

    return tokens;
  }

  /**
   * Faz logout do usuário (invalida refresh token)
   * @param userId - ID do usuário
   * @param refreshToken - Refresh token a invalidar
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    // Deleta refresh token específico
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });

    logger.info('User logged out', { userId });
  }

  /**
   * Faz logout de todas as sessões do usuário
   * @param userId - ID do usuário
   */
  async logoutAllSessions(userId: string): Promise<void> {
    // Deleta TODOS os refresh tokens do usuário
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    logger.info('User logged out from all sessions', { userId });
  }

  /**
   * Busca perfil do usuário
   * @param userId - ID do usuário
   * @returns Dados do usuário
   */
  async getProfile(userId: string): Promise<UserResponse> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Atualiza perfil do usuário
   * @param userId - ID do usuário
   * @param data - Dados a atualizar
   * @returns Dados do usuário atualizado
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileDTO
  ): Promise<UserResponse> {
    // Se email foi fornecido, verifica se já existe
    if (data.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('Email já cadastrado por outro usuário');
      }
    }

    // Se CPF foi fornecido, verifica se já existe
    if (data.cpf) {
      const existingUser = await userRepository.findByCpf(data.cpf);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('CPF já cadastrado por outro usuário');
      }
    }

    // Atualiza usuário
    const user = await userRepository.update(userId, data);

    logger.info('User profile updated', {
      userId: user.id,
      updatedFields: Object.keys(data),
    });

    // Envia email de notificação de alteração (não bloqueia se falhar)
    logger.info('Attempting to send profile update notification', {
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      updatedFields: Object.keys(data),
    });
    
    emailService
      .sendProfileUpdateNotification({
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        updatedFields: Object.keys(data),
        updateDate: new Date(),
      })
      .then((result) => {
        if (result.success) {
          logger.info('Profile update notification sent successfully', {
            userId: user.id,
            email: user.email,
            messageId: result.messageId,
          });
        } else {
          logger.error('Failed to send profile update notification email', {
            userId: user.id,
            error: result.error,
          });
        }
      })
      .catch((error) => {
        logger.error('Failed to send profile update notification email - exception caught', {
          userId: user.id,
          error: error.message || error,
          stack: error.stack,
        });
      });

    return this.sanitizeUser(user);
  }

  /**
   * Muda senha do usuário
   * @param userId - ID do usuário
   * @param currentPassword - Senha atual
   * @param newPassword - Nova senha
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Busca usuário com senha
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Verifica senha atual
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    // Valida força da nova senha
    const passwordValidation = validatePasswordStrength(newPassword);

    if (!passwordValidation.isValid) {
      throw new ValidationError(
        'Nova senha não atende aos requisitos de segurança',
        { errors: passwordValidation.errors }
      );
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword);

    // Atualiza senha
    await userRepository.updatePassword(userId, hashedPassword);

    // Invalida todos os refresh tokens (força re-login)
    await this.logoutAllSessions(userId);

    logger.info('User password changed', { userId });
  }

  /**
   * Deleta conta do usuário permanentemente
   * Remove TODOS os dados relacionados ao usuário (LGPD)
   * @param userId - ID do usuário
   * @param password - Senha para confirmar exclusão
   */
  async deleteAccount(userId: string, password: string): Promise<void> {
    // Busca usuário com senha
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Valida senha
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Senha incorreta');
    }

    logger.info('Starting account deletion', { 
      userId, 
      email: user.email 
    });

    try {
      // Deleta dados em cascata (seguindo ordem de dependências)
      
      // 1. Orders (não tem CASCADE, precisa deletar manualmente)
      // Primeiro busca todos os pedidos
      const orders = await prisma.order.findMany({
        where: { userId },
        select: { id: true }
      });
      
      // Deleta OrderItems de cada pedido
      for (const order of orders) {
        await prisma.orderItem.deleteMany({
          where: { orderId: order.id }
        });
      }
      
      // Agora deleta os Orders
      await prisma.order.deleteMany({
        where: { userId }
      });

      // 2-6. Os demais têm CASCADE configurado no schema, mas vamos deletar explicitamente
      // para garantir e ter controle do processo
      
      // Cart e CartItems (CASCADE)
      await prisma.cart.deleteMany({
        where: { userId }
      });

      // Reviews (CASCADE)
      await prisma.review.deleteMany({
        where: { userId }
      });

      // Addresses (CASCADE)
      await prisma.address.deleteMany({
        where: { userId }
      });

      // RefreshTokens (CASCADE)
      await prisma.refreshToken.deleteMany({
        where: { userId }
      });

      // AuditLogs (SetNull configurado, mas vamos deletar)
      await prisma.auditLog.deleteMany({
        where: { userId }
      });

      // 7. Finalmente, deleta o usuário
      await userRepository.delete(userId);

      logger.info('Account deleted successfully', {
        userId,
        email: user.email,
        deletedOrders: orders.length,
      });
    } catch (error) {
      logger.error('Error deleting account', {
        userId,
        email: user.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Erro ao deletar conta. Por favor, tente novamente.');
    }
  }

  /**
   * Remove dados sensíveis do usuário
   * @param user - Usuário com todos os campos
   * @returns Usuário sem dados sensíveis
   */
  private sanitizeUser(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      cpf: user.cpf,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
  }
}

// Exporta instância única (Singleton)
export const authService = new AuthService();
