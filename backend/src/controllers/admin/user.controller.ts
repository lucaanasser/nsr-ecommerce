import { Request, Response } from 'express';
import { UserService } from '@services/user.service';
import { UserRole } from '@prisma/client';

const userService = new UserService();

export const getUsers = async (req: Request, res: Response) => {
  const filters = {
    search: req.query['search'] as string,
    role: req.query['role'] as UserRole,
    status: req.query['status'] as 'active' | 'inactive',
    page: req.query['page'] ? Number(req.query['page']) : 1,
    limit: req.query['limit'] ? Number(req.query['limit']) : 10,
  };

  const result = await userService.getUsers(filters);
  
  res.json({
    success: true,
    ...result
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
    return;
  }

  res.json({
    success: true,
    data: user
  });
};
