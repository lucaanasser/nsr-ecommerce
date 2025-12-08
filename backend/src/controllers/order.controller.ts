/**
 * Controller responsável por manipular endpoints de pedidos do usuário.
 * Implementa handlers para criação, listagem, busca e cancelamento de pedidos.
 */
import { Request, Response } from 'express';
import { OrderService } from '@services/order.service';

const orderService = new OrderService();

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const order = await orderService.createOrder(userId, req.body);
  
  res.status(201).json({
    success: true,
    data: order
  });
};

export const getOrders = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const orders = await orderService.getOrders(userId);
  
  res.json({
    success: true,
    data: orders
  });
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const orderId = req.params['id'];
  
  if (!orderId) {
    res.status(400).json({
      success: false,
      message: 'ID do pedido é obrigatório'
    });
    return;
  }
  
  const order = await orderService.getOrderById(orderId, userId);
  
  res.json({
    success: true,
    data: order
  });
};

export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const { reason } = req.body;
  const orderId = req.params['id'];
  
  if (!orderId) {
    res.status(400).json({
      success: false,
      message: 'ID do pedido é obrigatório'
    });
    return;
  }
  
  await orderService.cancelOrder(userId, orderId, reason);
  
  res.json({
    success: true,
    message: 'Pedido cancelado com sucesso'
  });
};

/**
 * Retry payment for a pending order
 */
export const retryPayment = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const orderId = req.params['id'];
  const { paymentMethod, creditCard } = req.body;
  
  if (!orderId) {
    res.status(400).json({
      success: false,
      message: 'ID do pedido é obrigatório'
    });
    return;
  }
  
  const result = await orderService.retryPayment(userId, orderId, {
    paymentMethod,
    creditCard,
  });
  
  res.json({
    success: true,
    data: result,
  });
};

/**
 * Get payment status for an order
 */
export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const orderId = req.params['id'];
  
  if (!orderId) {
    res.status(400).json({
      success: false,
      message: 'ID do pedido é obrigatório'
    });
    return;
  }
  
  const status = await orderService.getPaymentStatus(userId, orderId);
  
  res.json({
    success: true,
    data: status,
  });
};
