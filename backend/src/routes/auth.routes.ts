import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';
import { validateBody } from '../middlewares/validate';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registra novo usuário
 * @access  Public
 */
router.post(
  '/register',
  validateBody(registerSchema),
  authController.register.bind(authController)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Autentica usuário e retorna tokens
 * @access  Public
 */
router.post(
  '/login',
  validateBody(loginSchema),
  authController.login.bind(authController)
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Renova access token usando refresh token
 * @access  Public
 */
router.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  authController.refresh.bind(authController)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Faz logout do usuário (invalida refresh token)
 * @access  Private
 */
router.post(
  '/logout',
  authenticate as any,
  validateBody(refreshTokenSchema),
  authController.logout.bind(authController) as any
);

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Faz logout de todas as sessões do usuário
 * @access  Private
 */
router.post(
  '/logout-all',
  authenticate as any,
  authController.logoutAll.bind(authController) as any
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Retorna perfil do usuário autenticado
 * @access  Private
 */
router.get(
  '/me',
  authenticate as any,
  authController.getProfile.bind(authController) as any
);

/**
 * @route   PUT /api/v1/auth/me
 * @desc    Atualiza perfil do usuário autenticado
 * @access  Private
 */
router.put(
  '/me',
  authenticate as any,
  validateBody(updateProfileSchema),
  authController.updateProfile.bind(authController) as any
);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Muda senha do usuário autenticado
 * @access  Private
 */
router.put(
  '/change-password',
  authenticate as any,
  validateBody(changePasswordSchema),
  authController.changePassword.bind(authController) as any
);

export default router;
