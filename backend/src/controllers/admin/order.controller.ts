import { Request, Response } from 'express';
import { OrderService } from '@services/order.service';
import { OrderStatus } from '@prisma/client';

const orderService = new OrderService();

export const getOrders = async (req: Request, res: Response) => {
  const filters = {
    status: req.query['status'] as string,
    page: req.query['page'] ? Number(req.query['page']) : 1,
    limit: req.query['limit'] ? Number(req.query['limit']) : 10,
    search: req.query['search'] as string,
    startDate: req.query['startDate'] as string,
    endDate: req.query['endDate'] as string,
  };

  const result = await orderService.getAllOrders(filters);
  
  res.json({
    success: true,
    ...result
  });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'ID do pedido é obrigatório'
    });
    return;
  }

  if (!Object.values(OrderStatus).includes(status)) {
    res.status(400).json({
      success: false,
      message: 'Status inválido'
    });
    return;
  }

  const order = await orderService.updateOrderStatus(id, status);
  
  res.json({
    success: true,
    data: order
  });
};
