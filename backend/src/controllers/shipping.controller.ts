/**
 * Controller responsável por manipular endpoints de cálculo e métodos de frete.
 * Implementa handlers para cálculo de frete e listagem de métodos disponíveis.
 */
import { Request, Response } from 'express';
import { ShippingService } from '@services/shipping.service';

const shippingService = new ShippingService();

export const calculateShipping = async (req: Request, res: Response) => {
  const result = await shippingService.calculateShipping(req.body);
  
  res.json({
    success: true,
    data: result
  });
};

export const getShippingMethods = async (_req: Request, res: Response) => {
  const methods = await shippingService.getShippingMethods();
  
  res.json({
    success: true,
    data: methods
  });
};
