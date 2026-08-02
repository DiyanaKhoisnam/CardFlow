"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const card_service_1 = require("../services/card.service");
const response_utils_1 = require("../utils/response.utils");
class CardController {
    static async getUserCards(req, res, next) {
        try {
            const userId = req.user.userId;
            const cards = await card_service_1.CardService.getUserCards(userId);
            (0, response_utils_1.sendSuccess)(res, 200, 'User credit cards retrieved', cards);
        }
        catch (error) {
            next(error);
        }
    }
    static async getCardById(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const card = await card_service_1.CardService.getCardById(userId, id);
            (0, response_utils_1.sendSuccess)(res, 200, 'Credit card details retrieved', card);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCardStatus(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { status } = req.body;
            const updatedCard = await card_service_1.CardService.updateCardStatus(userId, id, status);
            (0, response_utils_1.sendSuccess)(res, 200, `Card status updated to ${status}`, updatedCard);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CardController = CardController;
