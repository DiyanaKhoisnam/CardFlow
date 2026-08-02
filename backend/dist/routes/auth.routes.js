"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public Authentication Endpoints
router.post('/register', (0, validate_middleware_1.validateRequest)(auth_validator_1.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validate_middleware_1.validateRequest)(auth_validator_1.loginSchema), auth_controller_1.AuthController.login);
router.post('/logout', auth_controller_1.AuthController.logout);
router.post('/refresh', (0, validate_middleware_1.validateRequest)(auth_validator_1.refreshTokenSchema), auth_controller_1.AuthController.refreshToken);
// Protected Auth Endpoints
router.get('/me', auth_middleware_1.authenticateJwt, auth_controller_1.AuthController.getMe);
router.post('/change-password', auth_middleware_1.authenticateJwt, (0, validate_middleware_1.validateRequest)(auth_validator_1.changePasswordSchema), auth_controller_1.AuthController.changePassword);
router.patch('/profile', auth_middleware_1.authenticateJwt, (0, validate_middleware_1.validateRequest)(auth_validator_1.updateProfileSchema), auth_controller_1.AuthController.updateProfile);
exports.default = router;
