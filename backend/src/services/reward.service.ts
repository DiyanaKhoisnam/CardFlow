import { prisma } from '../config/db';
import { RewardStatus } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class RewardService {
  /**
   * Get rewards catalog and user's points calculation.
   */
  static async getUserRewards(userId: string) {
    const rewards = await prisma.reward.findMany({
      where: { userId },
      orderBy: { pointsRequired: 'asc' },
    });

    // Calculate total points based on completed transactions ($1 spent = 1 point)
    const transactions = await prisma.transaction.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { amount: true },
    });

    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Total earned points
    const earnedPoints = Math.floor(totalSpent * 1);

    // Redeemed points
    const redeemedRewards = rewards.filter((r) => r.status === RewardStatus.REDEEMED);
    const redeemedPoints = redeemedRewards.reduce((sum, r) => sum + r.pointsRequired, 0);

    const availablePoints = Math.max(0, earnedPoints - redeemedPoints);

    return {
      rewards,
      summary: {
        totalEarnedPoints: earnedPoints,
        redeemedPoints,
        availablePoints,
      },
    };
  }

  /**
   * Redeem a reward item.
   */
  static async redeemReward(userId: string, rewardId: string) {
    const reward = await prisma.reward.findFirst({
      where: { id: rewardId, userId },
    });

    if (!reward) {
      throw new AppError('Reward item not found', 404);
    }

    if (reward.status === RewardStatus.REDEEMED) {
      throw new AppError('This reward has already been redeemed', 400);
    }

    const { summary } = await this.getUserRewards(userId);

    if (summary.availablePoints < reward.pointsRequired) {
      throw new AppError(
        `Insufficient points balance. You need ${reward.pointsRequired} points, but have ${summary.availablePoints} points.`,
        400
      );
    }

    const updatedReward = await prisma.reward.update({
      where: { id: rewardId },
      data: {
        status: RewardStatus.REDEEMED,
        redeemedAt: new Date(),
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Reward Redeemed!',
        message: `Successfully redeemed "${reward.title}" for ${reward.pointsRequired} points.`,
        type: 'SUCCESS',
      },
    });

    return updatedReward;
  }
}
