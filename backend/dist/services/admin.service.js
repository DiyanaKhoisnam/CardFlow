"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const db_1 = require("../config/db");
const client_1 = require("@prisma/client");
const error_middleware_1 = require("../middleware/error.middleware");
class AdminService {
    /**
     * Summary KPI metrics for the Admin Dashboard.
     */
    static async getDashboardSummary() {
        const [totalUsers, activeCardsCount, blockedCardsCount, monthlyTransactionsAggregate, pendingApplicationsCount] = await Promise.all([
            db_1.prisma.user.count({ where: { role: client_1.Role.CUSTOMER } }),
            db_1.prisma.card.count({ where: { status: client_1.CardStatus.ACTIVE, applicationStatus: client_1.CardApplicationStatus.APPROVED } }),
            db_1.prisma.card.count({ where: { status: client_1.CardStatus.BLOCKED } }),
            db_1.prisma.transaction.aggregate({
                _sum: { amount: true },
                _count: { id: true },
                where: {
                    date: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                    status: 'COMPLETED',
                },
            }),
            db_1.prisma.card.count({ where: { applicationStatus: client_1.CardApplicationStatus.PENDING } }),
        ]);
        const recentPendingCards = await db_1.prisma.card.findMany({
            where: { applicationStatus: client_1.CardApplicationStatus.PENDING },
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
    static async getUsers(params) {
        const page = Math.max(1, params.page || 1);
        const limit = Math.max(1, Math.min(50, params.limit || 10));
        const skip = (page - 1) * limit;
        const where = {};
        if (params.role)
            where.role = params.role;
        if (params.isSuspended !== undefined)
            where.isSuspended = params.isSuspended;
        if (params.search && params.search.trim() !== '') {
            where.OR = [
                { email: { contains: params.search, mode: 'insensitive' } },
                { firstName: { contains: params.search, mode: 'insensitive' } },
                { lastName: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [users, totalCount] = await Promise.all([
            db_1.prisma.user.findMany({
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
            db_1.prisma.user.count({ where }),
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
    static async updateUserStatus(userId, isSuspended) {
        const user = await db_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new error_middleware_1.AppError('User account not found', 404);
        }
        if (user.role === client_1.Role.ADMIN) {
            throw new error_middleware_1.AppError('System Administrator accounts cannot be suspended', 400);
        }
        const updatedUser = await db_1.prisma.user.update({
            where: { id: userId },
            data: { isSuspended },
            select: { id: true, email: true, firstName: true, lastName: true, isSuspended: true },
        });
        // Notify user
        await db_1.prisma.notification.create({
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
    static async getCards(params) {
        const page = Math.max(1, params.page || 1);
        const limit = Math.max(1, Math.min(50, params.limit || 10));
        const skip = (page - 1) * limit;
        const where = {};
        if (params.status)
            where.status = params.status;
        if (params.applicationStatus)
            where.applicationStatus = params.applicationStatus;
        const [cards, totalCount] = await Promise.all([
            db_1.prisma.card.findMany({
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
            db_1.prisma.card.count({ where }),
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
    static async approveCard(cardId) {
        const card = await db_1.prisma.card.findUnique({ where: { id: cardId } });
        if (!card)
            throw new error_middleware_1.AppError('Card application not found', 404);
        const updatedCard = await db_1.prisma.card.update({
            where: { id: cardId },
            data: {
                applicationStatus: client_1.CardApplicationStatus.APPROVED,
                status: client_1.CardStatus.ACTIVE,
            },
        });
        await db_1.prisma.notification.create({
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
    static async rejectCard(cardId) {
        const card = await db_1.prisma.card.findUnique({ where: { id: cardId } });
        if (!card)
            throw new error_middleware_1.AppError('Card application not found', 404);
        const updatedCard = await db_1.prisma.card.update({
            where: { id: cardId },
            data: {
                applicationStatus: client_1.CardApplicationStatus.REJECTED,
                status: client_1.CardStatus.BLOCKED,
            },
        });
        await db_1.prisma.notification.create({
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
    static async updateCardStatus(cardId, status) {
        const card = await db_1.prisma.card.findUnique({ where: { id: cardId } });
        if (!card)
            throw new error_middleware_1.AppError('Card not found', 404);
        const updatedCard = await db_1.prisma.card.update({
            where: { id: cardId },
            data: { status },
        });
        await db_1.prisma.notification.create({
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
    static async getAllTransactions(params) {
        const page = Math.max(1, params.page || 1);
        const limit = Math.max(1, Math.min(50, params.limit || 10));
        const skip = (page - 1) * limit;
        const where = {};
        if (params.search && params.search.trim() !== '') {
            where.OR = [
                { merchant: { contains: params.search, mode: 'insensitive' } },
                { user: { email: { contains: params.search, mode: 'insensitive' } } },
            ];
        }
        const [transactions, totalCount] = await Promise.all([
            db_1.prisma.transaction.findMany({
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
            db_1.prisma.transaction.count({ where }),
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
        const cards = await db_1.prisma.card.findMany({ select: { cardType: true } });
        const cardUsage = {};
        cards.forEach((c) => {
            cardUsage[c.cardType] = (cardUsage[c.cardType] || 0) + 1;
        });
        const cardTypeDistribution = Object.entries(cardUsage).map(([type, count]) => ({
            type: type.replace('_', ' '),
            count,
        }));
        // Monthly volume
        const transactions = await db_1.prisma.transaction.findMany({
            where: { status: 'COMPLETED' },
            select: { amount: true, date: true },
        });
        const monthlyMap = {};
        transactions.forEach((tx) => {
            const monthYear = new Date(tx.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + tx.amount;
        });
        const spendingTrends = Object.entries(monthlyMap).map(([month, volume]) => ({
            month,
            volume: Math.round(volume * 100) / 100,
        }));
        // User growth
        const users = await db_1.prisma.user.findMany({ select: { createdAt: true } });
        const userGrowthMap = {};
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
exports.AdminService = AdminService;
