"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const db_1 = require("../config/db");
const client_1 = require("@prisma/client");
const error_middleware_1 = require("../middleware/error.middleware");
class CardService {
    /**
     * Fetch all credit cards assigned to a specific user.
     */
    static async getUserCards(userId) {
        const cards = await db_1.prisma.card.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return cards;
    }
    /**
     * Fetch details of a single credit card.
     */
    static async getCardById(userId, cardId) {
        const card = await db_1.prisma.card.findFirst({
            where: { id: cardId, userId },
            include: {
                transactions: {
                    take: 5,
                    orderBy: { date: 'desc' },
                },
            },
        });
        if (!card) {
            throw new error_middleware_1.AppError('Credit card not found or unauthorized', 404);
        }
        return card;
    }
    /**
     * Update status of a credit card (Freeze, Unfreeze, Block).
     */
    static async updateCardStatus(userId, cardId, status) {
        const card = await db_1.prisma.card.findFirst({
            where: { id: cardId, userId },
        });
        if (!card) {
            throw new error_middleware_1.AppError('Credit card not found', 404);
        }
        if (card.status === client_1.CardStatus.BLOCKED) {
            throw new error_middleware_1.AppError('Blocked cards cannot be modified. Please contact support.', 400);
        }
        const updatedCard = await db_1.prisma.card.update({
            where: { id: cardId },
            data: { status },
        });
        // Create system notification for card status change
        await db_1.prisma.notification.create({
            data: {
                userId,
                title: `Card Status Updated`,
                message: `Your card ending in ${card.cardNumber.slice(-4)} has been changed to status: ${status}`,
                type: status === 'BLOCKED' ? 'ALERT' : 'INFO',
            },
        });
        return updatedCard;
    }
}
exports.CardService = CardService;
