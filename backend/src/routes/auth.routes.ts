import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema, updateProfileSchema } from '../validators/auth.validator';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

// Public Authentication Endpoints
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refreshToken);

// Protected Auth Endpoints
router.get('/me', authenticateJwt, AuthController.getMe);
router.post('/change-password', authenticateJwt, validateRequest(changePasswordSchema), AuthController.changePassword);
router.patch('/profile', authenticateJwt, validateRequest(updateProfileSchema), AuthController.updateProfile);

export default router;
