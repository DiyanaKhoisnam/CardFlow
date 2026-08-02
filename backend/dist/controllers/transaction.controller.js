"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = require("../services/transaction.service");
const response_utils_1 = require("../utils/response.utils");
class TransactionController {
    static async getUserTransactions(req, res, next) {
        try {
            const userId = req.user.userId;
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const search = req.query.search;
            const category = req.query.category;
            const status = req.query.status;
            const result = await transaction_service_1.TransactionService.getUserTransactions(userId, {
                page,
                limit,
                search,
                category,
                status,
            });
            (0, response_utils_1.sendSuccess)(res, 200, 'Transactions retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getSpendingAnalytics(req, res, next) {
        try {
            const userId = req.user.userId;
            const analytics = await transaction_service_1.TransactionService.getSpendingAnalytics(userId);
            (0, response_utils_1.sendSuccess)(res, 200, 'Spending analytics retrieved', analytics);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TransactionController = TransactionController;
