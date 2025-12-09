import { Router, RequestHandler } from 'express';
import * as userController from '@controllers/admin/user.controller';
import { authenticate } from '@middlewares/authenticate';
import { authorize } from '@middlewares/authorize';

const router = Router();

// Todas as rotas requerem autenticação e permissão de ADMIN
router.use(authenticate as RequestHandler);
router.use(authorize('ADMIN') as RequestHandler);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

export default router;
