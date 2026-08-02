"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const admin_validator_1 = require("../validators/admin.validator");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Strict RBAC Middleware: Require Valid JWT AND Admin Role
router.use(auth_middleware_1.authenticateJwt);
router.use((0, role_middleware_1.authorizeRoles)(client_1.Role.ADMIN));
// Dashboard Summary & Analytics
router.get('/dashboard-summary', admin_controller_1.AdminController.getDashboardSummary);
router.get('/analytics', admin_controller_1.AdminController.getAdminAnalytics);
// User Management Endpoints
router.get('/users', admin_controller_1.AdminController.getUsers);
router.patch('/users/:id/status', (0, validate_middleware_1.validateRequest)(admin_validator_1.updateUserStatusSchema), admin_controller_1.AdminController.updateUserStatus);
// Credit Card Application & Card Control Endpoints
router.get('/cards', admin_controller_1.AdminController.getCards);
router.patch('/cards/:id/approve', admin_controller_1.AdminController.approveCard);
router.patch('/cards/:id/reject', admin_controller_1.AdminController.rejectCard);
router.patch('/cards/:id/status', (0, validate_middleware_1.validateRequest)(admin_validator_1.updateAdminCardStatusSchema), admin_controller_1.AdminController.updateCardStatus);
// System-Wide Transaction Audit Endpoint
router.get('/transactions', admin_controller_1.AdminController.getAllTransactions);
exports.default = router;
