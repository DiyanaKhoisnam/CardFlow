import { Router } from 'express';
import { RewardController } from '../controllers/reward.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/', RewardController.getUserRewards);
router.post('/:id/redeem', RewardController.redeemReward);

export default router;
