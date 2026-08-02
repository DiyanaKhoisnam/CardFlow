import { prisma } from '../config/db';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  /**
   * Register a new user and generate initial JWT tokens.
   */
  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError('An account with this email address already exists', 400);
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
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
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token to database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.refreshToken.create({
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
  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
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
  static async logout(refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }
    return true;
  }

  /**
   * Refresh expired Access Token using a valid Refresh Token.
   */
  static async refreshAccessToken(rawRefreshToken: string) {
    let decoded;
    try {
      decoded = verifyRefreshToken(rawRefreshToken);
    } catch (err) {
      throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: rawRefreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || new Date() > storedToken.expiresAt) {
      throw new AppError('Refresh token has been revoked or expired', 401);
    }

    const payload = {
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    };

    const newAccessToken = generateAccessToken(payload);
    return { accessToken: newAccessToken };
  }

  /**
   * Fetch details of currently authenticated user.
   */
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
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
      throw new AppError('User profile not found', 404);
    }

    return user;
  }

  /**
   * Change user password securely.
   */
  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await comparePassword(currentPass, user.password);
    if (!isMatch) {
      throw new AppError('Current password provided is incorrect', 400);
    }

    const hashedNewPassword = await hashPassword(newPass);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Notify user
    await prisma.notification.create({
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
  static async updateProfile(userId: string, firstName: string, lastName: string) {
    const updatedUser = await prisma.user.update({
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
