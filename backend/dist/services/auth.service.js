"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../config/db");
const password_utils_1 = require("../utils/password.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const error_middleware_1 = require("../middleware/error.middleware");
class AuthService {
    /**
     * Register a new user and generate initial JWT tokens.
     */
    static async register(input) {
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (existingUser) {
            throw new error_middleware_1.AppError('An account with this email address already exists', 400);
        }
        const hashedPassword = await (0, password_utils_1.hashPassword)(input.password);
        const user = await db_1.prisma.user.create({
            data: {
                email: input.email.toLowerCase(),
                password: hashedPassword,
                firstName: input.firstName,
                lastName: input.lastName,
                role: input.role,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_utils_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_utils_1.generateRefreshToken)(payload);
        // Save refresh token to database
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await db_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });
        return { user, accessToken, refreshToken };
    }
    /**
     * Authenticate existing user by verifying password credentials.
     */
    static async login(input) {
        const user = await db_1.prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (!user) {
            throw new error_middleware_1.AppError('Invalid email or password credentials', 401);
        }
        const isPasswordValid = await (0, password_utils_1.comparePassword)(input.password, user.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError('Invalid email or password credentials', 401);
        }
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_utils_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_utils_1.generateRefreshToken)(payload);
        // Store refresh token
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });
        const userProfile = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
        };
        return { user: userProfile, accessToken, refreshToken };
    }
    /**
     * Revoke existing refresh token on user logout.
     */
    static async logout(refreshToken) {
        if (refreshToken) {
            await db_1.prisma.refreshToken.updateMany({
                where: { token: refreshToken },
                data: { revoked: true },
            });
        }
        return true;
    }
    /**
     * Refresh expired Access Token using a valid Refresh Token.
     */
    static async refreshAccessToken(rawRefreshToken) {
        let decoded;
        try {
            decoded = (0, jwt_utils_1.verifyRefreshToken)(rawRefreshToken);
        }
        catch (err) {
            throw new error_middleware_1.AppError('Invalid or expired refresh token. Please log in again.', 401);
        }
        const storedToken = await db_1.prisma.refreshToken.findUnique({
            where: { token: rawRefreshToken },
            include: { user: true },
        });
        if (!storedToken || storedToken.revoked || new Date() > storedToken.expiresAt) {
            throw new error_middleware_1.AppError('Refresh token has been revoked or expired', 401);
        }
        const payload = {
            userId: storedToken.user.id,
            email: storedToken.user.email,
            role: storedToken.user.role,
        };
        const newAccessToken = (0, jwt_utils_1.generateAccessToken)(payload);
        return { accessToken: newAccessToken };
    }
    /**
     * Fetch details of currently authenticated user.
     */
    static async getUserProfile(userId) {
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isSuspended: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new error_middleware_1.AppError('User profile not found', 404);
        }
        return user;
    }
    /**
     * Change user password securely.
     */
    static async changePassword(userId, currentPass, newPass) {
        const user = await db_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new error_middleware_1.AppError('User not found', 404);
        const isMatch = await (0, password_utils_1.comparePassword)(currentPass, user.password);
        if (!isMatch) {
            throw new error_middleware_1.AppError('Current password provided is incorrect', 400);
        }
        const hashedNewPassword = await (0, password_utils_1.hashPassword)(newPass);
        await db_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        // Notify user
        await db_1.prisma.notification.create({
            data: {
                userId,
                title: 'Security Alert: Password Changed',
                message: 'Your account password was successfully updated.',
                type: 'WARNING',
            },
        });
        return true;
    }
    /**
     * Update user profile names.
     */
    static async updateProfile(userId, firstName, lastName) {
        const updatedUser = await db_1.prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
        return updatedUser;
    }
}
exports.AuthService = AuthService;
