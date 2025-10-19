/**
 * Controller responsável por manipular requisições HTTP de autenticação e sessão de usuários.
 * Implementa endpoints de registro, login, refresh, logout e perfil.
 */
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types/auth.types';

/**
 * Auth Controller
 * Manipula requests HTTP relacionados à autenticação
 */
export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Registra novo usuário
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    // Cria usuário e autentica automaticamente após cadastro
    await authService.register(req.body);
    const loginResult = await authService.login(req.body.email, req.body.password);

        res.status(201).json({
          success: true,
          message: 'Usuário registrado e autenticado com sucesso',
          data: loginResult,
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Autentica usuário e retorna tokens
   */
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Renova access token usando refresh token
   */
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Tokens renovados com sucesso',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Faz logout do usuário (invalida refresh token)
   * Requer autenticação
   */
  async logout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await authService.logout(req.user.userId, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout-all
   * Faz logout de todas as sessões do usuário
   * Requer autenticação
   */
  async logoutAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.logoutAllSessions(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Logout de todas as sessões realizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Retorna perfil do usuário autenticado
   * Requer autenticação
   */
  async getProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.getProfile(req.user.userId);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/auth/me
   * Atualiza perfil do usuário autenticado
   * Requer autenticação
   */
  async updateProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.updateProfile(req.user.userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/auth/change-password
   * Muda senha do usuário autenticado
   * Requer autenticação
   */
  async changePassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        message: 'Senha alterada com sucesso. Por favor, faça login novamente.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/auth/account
   * Deleta conta do usuário permanentemente
   * Requer autenticação e senha
   */
  async deleteAccount(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { password } = req.body;
      
      if (!password) {
        return next(new Error('Senha é obrigatória para confirmar exclusão'));
      }

      await authService.deleteAccount(req.user.userId, password);

      res.status(200).json({
        success: true,
        message: 'Conta deletada com sucesso. Todos os seus dados foram removidos.',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Exporta instância única (Singleton)
export const authController = new AuthController();
