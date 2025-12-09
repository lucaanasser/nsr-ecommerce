import { Request, Response } from 'express';
import { DashboardService } from '@services/dashboard.service';

const dashboardService = new DashboardService();

export const getStats = async (_req: Request, res: Response) => {
  const stats = await dashboardService.getStats();
  
  res.json({
    success: true,
    data: stats
  });
};
