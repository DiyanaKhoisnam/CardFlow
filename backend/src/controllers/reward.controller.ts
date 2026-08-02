import { Request, Response, NextFunction } from 'express';
import { RewardService } from '../services/reward.service';
import { sendSuccess } from '../utils/response.utils';

export class RewardController {
  static async getUserRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const data = await RewardService.getUserRewards(userId);
      sendSuccess(res, 200, 'User rewards retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  static async redeemReward(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const reward = await RewardService.redeemReward(userId, id);
      sendSuccess(res, 200, 'Reward redeemed successfully', reward);
    } catch (error) {
      next(error);
    }
  }
}
