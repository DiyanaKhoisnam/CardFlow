import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response.utils';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      
      // Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, 201, 'User registered successfully', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);

      // Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, 200, 'Login successful', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      await AuthService.logout(refreshToken);

      res.clearCookie('refreshToken');
      sendSuccess(res, 200, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Refresh token is missing' });
        return;
      }

      const result = await AuthService.refreshAccessToken(refreshToken);
      sendSuccess(res, 200, 'Token refreshed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await AuthService.getUserProfile(req.user.userId);
      sendSuccess(res, 200, 'Current user profile fetched', { user });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(userId, currentPassword, newPassword);
      sendSuccess(res, 200, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { firstName, lastName } = req.body;
      const user = await AuthService.updateProfile(userId, firstName, lastName);
      sendSuccess(res, 200, 'Profile updated successfully', { user });
    } catch (error) {
      next(error);
    }
  }
}
