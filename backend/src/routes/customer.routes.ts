import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/dashboard-summary', CustomerController.getDashboardSummary);
router.get('/statements', CustomerController.getMonthlyStatements);

export default router;
