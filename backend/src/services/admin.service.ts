import { prisma } from '../config/db';
import { CardStatus, CardApplicationStatus, Role, Prisma } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class AdminService {
  /**
   * Summary KPI metrics for the Admin Dashboard.
   */
  static async getDashboardSummary() {
    const [totalUsers, activeCardsCount, blockedCardsCount, monthlyTransactionsAggregate, pendingApplicationsCount] =
      await Promise.all([
        prisma.user.count({ where: { role: Role.CUSTOMER } }),
        prisma.card.count({ where: { status: CardStatus.ACTIVE, applicationStatus: CardApplicationStatus.APPROVED } }),
        prisma.card.count({ where: { status: CardStatus.BLOCKED } }),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          _count: { id: true },
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
            status: 'COMPLETED',
          },
        }),
        prisma.card.count({ where: { applicationStatus: CardApplicationStatus.PENDING } }),
      ]);

    const recentPendingCards = await prisma.card.findMany({
      where: { applicationStatus: CardApplicationStatus.PENDING },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    return {
      summary: {
        totalUsers,
        activeCards: activeCardsCount,
        blockedCards: blockedCardsCount,
        monthlyTransactionsVolume: Math.round((monthlyTransactionsAggregate._sum.amount || 0) * 100) / 100,
        monthlyTransactionsCount: monthlyTransactionsAggregate._count.id || 0,
        pendingApplicationsCount,
      },
      recentPendingCards,
    };
  }

  /**
   * Get all users with search, role filter, and pagination.
   */
  static async getUsers(params: { page?: number; limit?: number; search?: string; role?: Role; isSuspended?: boolean }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(50, params.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (params.role) where.role = params.role;
    if (params.isSuspended !== undefined) where.isSuspended = params.isSuspended;

    if (params.search && params.search.trim() !== '') {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isSuspended: true,
          createdAt: true,
          _count: {
            select: { cards: true, transactions: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Suspend or Activate a User Account.
   */
  static async updateUserStatus(userId: string, isSuspended: boolean) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User account not found', 404);
    }

    if (user.role === Role.ADMIN) {
      throw new AppError('System Administrator accounts cannot be suspended', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended },
      select: { id: true, email: true, firstName: true, lastName: true, isSuspended: true },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId,
        title: isSuspended ? 'Account Suspended' : 'Account Re-Activated',
        message: isSuspended
          ? 'Your ApexCard account has been suspended by an administrator.'
          : 'Your ApexCard account has been re-activated.',
        type: isSuspended ? 'ALERT' : 'SUCCESS',
      },
    });

    return updatedUser;
  }

  /**
   * Get all system credit cards and applications.
   */
  static async getCards(params: { page?: number; limit?: number; status?: CardStatus; applicationStatus?: CardApplicationStatus }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(50, params.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.CardWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.applicationStatus) where.applicationStatus = params.applicationStatus;

    const [cards, totalCount] = await Promise.all([
      prisma.card.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.card.count({ where }),
    ]);

    return {
      cards,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Approve a pending credit card application.
   */
  static async approveCard(cardId: string) {
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new AppError('Card application not found', 404);

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        applicationStatus: CardApplicationStatus.APPROVED,
        status: CardStatus.ACTIVE,
      },
    });

    await prisma.notification.create({
      data: {
        userId: card.userId,
        title: 'Credit Card Approved!',
        message: `Your ${card.cardType.replace('_', ' ')} credit card application has been approved.`,
        type: 'SUCCESS',
      },
    });

    return updatedCard;
  }

  /**
   * Reject a pending credit card application.
   */
  static async rejectCard(cardId: string) {
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new AppError('Card application not found', 404);

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        applicationStatus: CardApplicationStatus.REJECTED,
        status: CardStatus.BLOCKED,
      },
    });

    await prisma.notification.create({
      data: {
        userId: card.userId,
        title: 'Card Application Update',
        message: `Your credit card application was not approved at this time.`,
        type: 'ALERT',
      },
    });

    return updatedCard;
  }

  /**
   * Admin override to Freeze or Block any card.
   */
  static async updateCardStatus(cardId: string, status: CardStatus) {
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new AppError('Card not found', 404);

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: { status },
    });

    await prisma.notification.create({
      data: {
        userId: card.userId,
        title: `Card Status Changed`,
        message: `An administrator updated your card status to: ${status}`,
        type: status === 'BLOCKED' ? 'ALERT' : 'INFO',
      },
    });

    return updatedCard;
  }

  /**
   * View all system transactions across all users.
   */
  static async getAllTransactions(params: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(50, params.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {};
    if (params.search && params.search.trim() !== '') {
      where.OR = [
        { merchant: { contains: params.search, mode: 'insensitive' } },
        { user: { email: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          card: {
            select: { cardNumber: true, cardType: true },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * Enterprise analytics: Card usage breakdown, user acquisition growth, spending volume trends.
   */
  static async getAdminAnalytics() {
    const cards = await prisma.card.findMany({ select: { cardType: true } });
    const cardUsage: Record<string, number> = {};
    cards.forEach((c) => {
      cardUsage[c.cardType] = (cardUsage[c.cardType] || 0) + 1;
    });

    const cardTypeDistribution = Object.entries(cardUsage).map(([type, count]) => ({
      type: type.replace('_', ' '),
      count,
    }));

    // Monthly volume
    const transactions = await prisma.transaction.findMany({
      where: { status: 'COMPLETED' },
      select: { amount: true, date: true },
    });

    const monthlyMap: Record<string, number> = {};
    transactions.forEach((tx) => {
      const monthYear = new Date(tx.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + tx.amount;
    });

    const spendingTrends = Object.entries(monthlyMap).map(([month, volume]) => ({
      month,
      volume: Math.round(volume * 100) / 100,
    }));

    // User growth
    const users = await prisma.user.findMany({ select: { createdAt: true } });
    const userGrowthMap: Record<string, number> = {};
    users.forEach((u) => {
      const monthYear = new Date(u.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      userGrowthMap[monthYear] = (userGrowthMap[monthYear] || 0) + 1;
    });

    const userAcquisition = Object.entries(userGrowthMap).map(([month, newUsers]) => ({
      month,
      newUsers,
    }));

    return {
      cardTypeDistribution,
      spendingTrends,
      userAcquisition,
    };
  }
}
