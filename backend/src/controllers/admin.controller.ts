import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccess } from '../utils/response.utils';
import { Role, CardStatus, CardApplicationStatus } from '@prisma/client';

export class AdminController {
  static async getDashboardSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await AdminService.getDashboardSummary();
      sendSuccess(res, 200, 'Admin dashboard summary retrieved', summary);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string;
      const role = req.query.role as Role;
      const isSuspended = req.query.isSuspended !== undefined ? req.query.isSuspended === 'true' : undefined;

      const result = await AdminService.getUsers({ page, limit, search, role, isSuspended });
      sendSuccess(res, 200, 'Users list retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isSuspended } = req.body;
      const user = await AdminService.updateUserStatus(id, isSuspended);
      sendSuccess(res, 200, `User account ${isSuspended ? 'suspended' : 'activated'}`, user);
    } catch (error) {
      next(error);
    }
  }

  static async getCards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const status = req.query.status as CardStatus;
      const applicationStatus = req.query.applicationStatus as CardApplicationStatus;

      const result = await AdminService.getCards({ page, limit, status, applicationStatus });
      sendSuccess(res, 200, 'Cards portfolio retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  static async approveCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const card = await AdminService.approveCard(id);
      sendSuccess(res, 200, 'Credit card application approved', card);
    } catch (error) {
      next(error);
    }
  }

  static async rejectCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const card = await AdminService.rejectCard(id);
      sendSuccess(res, 200, 'Credit card application rejected', card);
    } catch (error) {
      next(error);
    }
  }

  static async updateCardStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const card = await AdminService.updateCardStatus(id, status);
      sendSuccess(res, 200, `Card status updated to ${status}`, card);
    } catch (error) {
      next(error);
    }
  }

  static async getAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string;

      const result = await AdminService.getAllTransactions({ page, limit, search });
      sendSuccess(res, 200, 'System transactions retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  static async getAdminAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AdminService.getAdminAnalytics();
      sendSuccess(res, 200, 'Admin analytics retrieved', analytics);
    } catch (error) {
      next(error);
    }
  }
}
