"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_utils_1 = require("../utils/response.utils");
class AuthController {
    static async register(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.register(req.body);
            // Set refresh token in HttpOnly cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            (0, response_utils_1.sendSuccess)(res, 201, 'User registered successfully', {
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            // Set refresh token in HttpOnly cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            (0, response_utils_1.sendSuccess)(res, 200, 'Login successful', {
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            await auth_service_1.AuthService.logout(refreshToken);
            res.clearCookie('refreshToken');
            (0, response_utils_1.sendSuccess)(res, 200, 'Logout successful');
        }
        catch (error) {
            next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ success: false, message: 'Refresh token is missing' });
                return;
            }
            const result = await auth_service_1.AuthService.refreshAccessToken(refreshToken);
            (0, response_utils_1.sendSuccess)(res, 200, 'Token refreshed successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getMe(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const user = await auth_service_1.AuthService.getUserProfile(req.user.userId);
            (0, response_utils_1.sendSuccess)(res, 200, 'Current user profile fetched', { user });
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;
            await auth_service_1.AuthService.changePassword(userId, currentPassword, newPassword);
            (0, response_utils_1.sendSuccess)(res, 200, 'Password updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const { firstName, lastName } = req.body;
            const user = await auth_service_1.AuthService.updateProfile(userId, firstName, lastName);
            (0, response_utils_1.sendSuccess)(res, 200, 'Profile updated successfully', { user });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
