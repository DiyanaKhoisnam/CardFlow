import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/', TransactionController.getUserTransactions);
router.get('/analytics', TransactionController.getSpendingAnalytics);

export default router;
