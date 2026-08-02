import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { sendSuccess } from '../utils/response.utils';

export class CustomerController {
  static async getDashboardSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const data = await CustomerService.getDashboardSummary(userId);
      sendSuccess(res, 200, 'Customer dashboard summary retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlyStatements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const statements = await CustomerService.getMonthlyStatements(userId);
      sendSuccess(res, 200, 'Monthly statements retrieved', statements);
    } catch (error) {
      next(error);
    }
  }
}
