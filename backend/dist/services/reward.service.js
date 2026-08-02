"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardService = void 0;
const db_1 = require("../config/db");
const client_1 = require("@prisma/client");
const error_middleware_1 = require("../middleware/error.middleware");
class RewardService {
    /**
     * Get rewards catalog and user's points calculation.
     */
    static async getUserRewards(userId) {
        const rewards = await db_1.prisma.reward.findMany({
            where: { userId },
            orderBy: { pointsRequired: 'asc' },
        });
        // Calculate total points based on completed transactions ($1 spent = 1 point)
        const transactions = await db_1.prisma.transaction.findMany({
            where: { userId, status: 'COMPLETED' },
            select: { amount: true },
        });
        const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        // Total earned points
        const earnedPoints = Math.floor(totalSpent * 1);
        // Redeemed points
        const redeemedRewards = rewards.filter((r) => r.status === client_1.RewardStatus.REDEEMED);
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
    static async redeemReward(userId, rewardId) {
        const reward = await db_1.prisma.reward.findFirst({
            where: { id: rewardId, userId },
        });
        if (!reward) {
            throw new error_middleware_1.AppError('Reward item not found', 404);
        }
        if (reward.status === client_1.RewardStatus.REDEEMED) {
            throw new error_middleware_1.AppError('This reward has already been redeemed', 400);
        }
        const { summary } = await this.getUserRewards(userId);
        if (summary.availablePoints < reward.pointsRequired) {
            throw new error_middleware_1.AppError(`Insufficient points balance. You need ${reward.pointsRequired} points, but have ${summary.availablePoints} points.`, 400);
        }
        const updatedReward = await db_1.prisma.reward.update({
            where: { id: rewardId },
            data: {
                status: client_1.RewardStatus.REDEEMED,
                redeemedAt: new Date(),
            },
        });
        // Create notification
        await db_1.prisma.notification.create({
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
exports.RewardService = RewardService;
