"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const db_1 = require("../config/db");
class CustomerService {
    /**
     * Aggregates key summary cards metrics for the customer dashboard.
     */
    static async getDashboardSummary(userId) {
        const cards = await db_1.prisma.card.findMany({
            where: { userId },
        });
        const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
        const totalAvailableCredit = cards.reduce((sum, card) => sum + card.availableCredit, 0);
        const totalOutstandingBalance = cards.reduce((sum, card) => sum + card.outstandingBalance, 0);
        // Calculate Reward Points
        const transactions = await db_1.prisma.transaction.findMany({
            where: { userId, status: 'COMPLETED' },
            select: { amount: true },
        });
        const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const earnedPoints = Math.floor(totalSpent);
        const redeemedRewards = await db_1.prisma.reward.findMany({
            where: { userId, status: 'REDEEMED' },
            select: { pointsRequired: true },
        });
        const redeemedPoints = redeemedRewards.reduce((sum, r) => sum + r.pointsRequired, 0);
        const rewardPoints = Math.max(0, earnedPoints - redeemedPoints);
        // Recent 5 transactions
        const recentTransactions = await db_1.prisma.transaction.findMany({
            where: { userId },
            take: 5,
            orderBy: { date: 'desc' },
            include: {
                card: {
                    select: { cardNumber: true },
                },
            },
        });
        // Unread Notifications
        const unreadNotifications = await db_1.prisma.notification.findMany({
            where: { userId, isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        return {
            summary: {
                totalCreditLimit: Math.round(totalCreditLimit * 100) / 100,
                totalAvailableCredit: Math.round(totalAvailableCredit * 100) / 100,
                totalOutstandingBalance: Math.round(totalOutstandingBalance * 100) / 100,
                rewardPoints,
                totalCardsCount: cards.length,
            },
            cards,
            recentTransactions,
            unreadNotifications,
        };
    }
    /**
     * Generate monthly statements breakdown.
     */
    static async getMonthlyStatements(userId) {
        const cards = await db_1.prisma.card.findMany({
            where: { userId },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                },
            },
        });
        // Group transactions by Month
        const statementsMap = {};
        cards.forEach((card) => {
            card.transactions.forEach((tx) => {
                const date = new Date(tx.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthName = date.toLocaleString('default', { month: 'long' });
                if (!statementsMap[monthKey]) {
                    statementsMap[monthKey] = {
                        month: `${monthName} ${date.getFullYear()}`,
                        year: date.getFullYear(),
                        totalSpent: 0,
                        transactionsCount: 0,
                        cardLast4: card.cardNumber.slice(-4),
                    };
                }
                statementsMap[monthKey].totalSpent += tx.amount;
                statementsMap[monthKey].transactionsCount += 1;
            });
        });
        const statements = Object.values(statementsMap).map((st) => ({
            ...st,
            totalSpent: Math.round(st.totalSpent * 100) / 100,
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'PAID',
        }));
        return statements;
    }
}
exports.CustomerService = CustomerService;
