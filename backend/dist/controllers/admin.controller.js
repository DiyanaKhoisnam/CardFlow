"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const response_utils_1 = require("../utils/response.utils");
class AdminController {
    static async getDashboardSummary(req, res, next) {
        try {
            const summary = await admin_service_1.AdminService.getDashboardSummary();
            (0, response_utils_1.sendSuccess)(res, 200, 'Admin dashboard summary retrieved', summary);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const search = req.query.search;
            const role = req.query.role;
            const isSuspended = req.query.isSuspended !== undefined ? req.query.isSuspended === 'true' : undefined;
            const result = await admin_service_1.AdminService.getUsers({ page, limit, search, role, isSuspended });
            (0, response_utils_1.sendSuccess)(res, 200, 'Users list retrieved', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateUserStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { isSuspended } = req.body;
            const user = await admin_service_1.AdminService.updateUserStatus(id, isSuspended);
            (0, response_utils_1.sendSuccess)(res, 200, `User account ${isSuspended ? 'suspended' : 'activated'}`, user);
        }
        catch (error) {
            next(error);
        }
    }
    static async getCards(req, res, next) {
        try {
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const status = req.query.status;
            const applicationStatus = req.query.applicationStatus;
            const result = await admin_service_1.AdminService.getCards({ page, limit, status, applicationStatus });
            (0, response_utils_1.sendSuccess)(res, 200, 'Cards portfolio retrieved', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async approveCard(req, res, next) {
        try {
            const { id } = req.params;
            const card = await admin_service_1.AdminService.approveCard(id);
            (0, response_utils_1.sendSuccess)(res, 200, 'Credit card application approved', card);
        }
        catch (error) {
            next(error);
        }
    }
    static async rejectCard(req, res, next) {
        try {
            const { id } = req.params;
            const card = await admin_service_1.AdminService.rejectCard(id);
            (0, response_utils_1.sendSuccess)(res, 200, 'Credit card application rejected', card);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCardStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const card = await admin_service_1.AdminService.updateCardStatus(id, status);
            (0, response_utils_1.sendSuccess)(res, 200, `Card status updated to ${status}`, card);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllTransactions(req, res, next) {
        try {
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const search = req.query.search;
            const result = await admin_service_1.AdminService.getAllTransactions({ page, limit, search });
            (0, response_utils_1.sendSuccess)(res, 200, 'System transactions retrieved', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAdminAnalytics(req, res, next) {
        try {
            const analytics = await admin_service_1.AdminService.getAdminAnalytics();
            (0, response_utils_1.sendSuccess)(res, 200, 'Admin analytics retrieved', analytics);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
