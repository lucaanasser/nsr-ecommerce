import { Router } from 'express';
import * as userController from '@controllers/admin/user.controller';
import { authenticate } from '@middlewares/authenticate';
import { authorize } from '@middlewares/authorize';

const router = Router();

// Todas as rotas requerem autenticação e permissão de ADMIN
router.use(authenticate, authorize('ADMIN'));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

export default router;
