import { prisma } from '../config/db';
import { CardStatus } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class CardService {
  /**
   * Fetch all credit cards assigned to a specific user.
   */
  static async getUserCards(userId: string) {
    const cards = await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return cards;
  }

  /**
   * Fetch details of a single credit card.
   */
  static async getCardById(userId: string, cardId: string) {
    const card = await prisma.card.findFirst({
      where: { id: cardId, userId },
      include: {
        transactions: {
          take: 5,
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!card) {
      throw new AppError('Credit card not found or unauthorized', 404);
    }

    return card;
  }

  /**
   * Update status of a credit card (Freeze, Unfreeze, Block).
   */
  static async updateCardStatus(userId: string, cardId: string, status: CardStatus) {
    const card = await prisma.card.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new AppError('Credit card not found', 404);
    }

    if (card.status === CardStatus.BLOCKED) {
      throw new AppError('Blocked cards cannot be modified. Please contact support.', 400);
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: { status },
    });

    // Create system notification for card status change
    await prisma.notification.create({
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
