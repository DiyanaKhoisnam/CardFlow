import { Router } from 'express';
import { CardController } from '../controllers/card.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateCardStatusSchema } from '../validators/card.validator';

const router = Router();

// All card endpoints require authentication
router.use(authenticateJwt);

router.get('/', CardController.getUserCards);
router.get('/:id', CardController.getCardById);
router.patch('/:id/status', validateRequest(updateCardStatusSchema), CardController.updateCardStatus);

export default router;
