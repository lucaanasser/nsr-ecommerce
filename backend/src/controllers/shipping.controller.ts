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
