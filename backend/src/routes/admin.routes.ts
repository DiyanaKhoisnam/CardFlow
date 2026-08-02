import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateUserStatusSchema, updateAdminCardStatusSchema } from '../validators/admin.validator';
import { Role } from '@prisma/client';

const router = Router();

// Strict RBAC Middleware: Require Valid JWT AND Admin Role
router.use(authenticateJwt);
router.use(authorizeRoles(Role.ADMIN));

// Dashboard Summary & Analytics
router.get('/dashboard-summary', AdminController.getDashboardSummary);
router.get('/analytics', AdminController.getAdminAnalytics);

// User Management Endpoints
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/status', validateRequest(updateUserStatusSchema), AdminController.updateUserStatus);

// Credit Card Application & Card Control Endpoints
router.get('/cards', AdminController.getCards);
router.patch('/cards/:id/approve', AdminController.approveCard);
router.patch('/cards/:id/reject', AdminController.rejectCard);
router.patch('/cards/:id/status', validateRequest(updateAdminCardStatusSchema), AdminController.updateCardStatus);

// System-Wide Transaction Audit Endpoint
router.get('/transactions', AdminController.getAllTransactions);

export default router;
