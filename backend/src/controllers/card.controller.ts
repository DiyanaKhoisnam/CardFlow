import { Request, Response, NextFunction } from 'express';
import { CardService } from '../services/card.service';
import { sendSuccess } from '../utils/response.utils';

export class CardController {
  static async getUserCards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const cards = await CardService.getUserCards(userId);
      sendSuccess(res, 200, 'User credit cards retrieved', cards);
    } catch (error) {
      next(error);
    }
  }

  static async getCardById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const card = await CardService.getCardById(userId, id);
      sendSuccess(res, 200, 'Credit card details retrieved', card);
    } catch (error) {
      next(error);
    }
  }

  static async updateCardStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const { status } = req.body;
      const updatedCard = await CardService.updateCardStatus(userId, id, status);
      sendSuccess(res, 200, `Card status updated to ${status}`, updatedCard);
    } catch (error) {
      next(error);
    }
  }
}
