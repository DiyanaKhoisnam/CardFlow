import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import { sendSuccess } from '../utils/response.utils';
import { TransactionCategory, TransactionStatus } from '@prisma/client';

export class TransactionController {
  static async getUserTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string;
      const category = req.query.category as TransactionCategory;
      const status = req.query.status as TransactionStatus;

      const result = await TransactionService.getUserTransactions(userId, {
        page,
        limit,
        search,
        category,
        status,
      });

      sendSuccess(res, 200, 'Transactions retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async getSpendingAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const analytics = await TransactionService.getSpendingAnalytics(userId);
      sendSuccess(res, 200, 'Spending analytics retrieved', analytics);
    } catch (error) {
      next(error);
    }
  }
}
