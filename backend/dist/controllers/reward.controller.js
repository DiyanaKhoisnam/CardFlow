"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardController = void 0;
const reward_service_1 = require("../services/reward.service");
const response_utils_1 = require("../utils/response.utils");
class RewardController {
    static async getUserRewards(req, res, next) {
        try {
            const userId = req.user.userId;
            const data = await reward_service_1.RewardService.getUserRewards(userId);
            (0, response_utils_1.sendSuccess)(res, 200, 'User rewards retrieved', data);
        }
        catch (error) {
            next(error);
        }
    }
    static async redeemReward(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const reward = await reward_service_1.RewardService.redeemReward(userId, id);
            (0, response_utils_1.sendSuccess)(res, 200, 'Reward redeemed successfully', reward);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RewardController = RewardController;
