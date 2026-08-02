"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customer_service_1 = require("../services/customer.service");
const response_utils_1 = require("../utils/response.utils");
class CustomerController {
    static async getDashboardSummary(req, res, next) {
        try {
            const userId = req.user.userId;
            const data = await customer_service_1.CustomerService.getDashboardSummary(userId);
            (0, response_utils_1.sendSuccess)(res, 200, 'Customer dashboard summary retrieved', data);
        }
        catch (error) {
            next(error);
        }
    }
    static async getMonthlyStatements(req, res, next) {
        try {
            const userId = req.user.userId;
            const statements = await customer_service_1.CustomerService.getMonthlyStatements(userId);
            (0, response_utils_1.sendSuccess)(res, 200, 'Monthly statements retrieved', statements);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CustomerController = CustomerController;
