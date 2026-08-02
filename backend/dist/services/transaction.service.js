"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const db_1 = require("../config/db");
const client_1 = require("@prisma/client");
class TransactionService {
    /**
     * Fetch paginated and filtered transactions for a user.
     */
    static async getUserTransactions(userId, params) {
        const page = Math.max(1, params.page || 1);
        const limit = Math.max(1, Math.min(50, params.limit || 10));
        const skip = (page - 1) * limit;
        const where = {
            userId,
        };
        if (params.category) {
            where.category = params.category;
        }
        if (params.status) {
            where.status = params.status;
        }
        if (params.search && params.search.trim() !== '') {
            where.OR = [
                { merchant: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [transactions, totalCount] = await Promise.all([
            db_1.prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { date: 'desc' },
                include: {
                    card: {
                        select: {
                            cardNumber: true,
                            cardType: true,
                        },
                    },
                },
            }),
            db_1.prisma.transaction.count({ where }),
        ]);
        const totalPages = Math.ceil(totalCount / limit);
        return {
            transactions,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    /**
     * Aggregate spending analytics for charts (Monthly Spending & Category Distribution).
     */
    static async getSpendingAnalytics(userId) {
        const transactions = await db_1.prisma.transaction.findMany({
            where: {
                userId,
                status: client_1.TransactionStatus.COMPLETED,
            },
        });
        // Aggregate by Category
        const categoryTotals = {};
        transactions.forEach((tx) => {
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        });
        const categorySpending = Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            amount: Math.round(amount * 100) / 100,
        }));
        // Aggregate by Month (last 6 months)
        const monthTotals = {};
        transactions.forEach((tx) => {
            const monthYear = new Date(tx.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            monthTotals[monthYear] = (monthTotals[monthYear] || 0) + tx.amount;
        });
        const monthlySpending = Object.entries(monthTotals).map(([month, amount]) => ({
            month,
            amount: Math.round(amount * 100) / 100,
        }));
        return {
            categorySpending,
            monthlySpending,
            totalSpent: Math.round(transactions.reduce((sum, tx) => sum + tx.amount, 0) * 100) / 100,
        };
    }
}
exports.TransactionService = TransactionService;
