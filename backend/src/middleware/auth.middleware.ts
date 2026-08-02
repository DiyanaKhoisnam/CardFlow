import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import { sendError } from '../utils/response.utils';

export const authenticateJwt = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'Authentication failed: No bearer token provided');
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendError(res, 401, 'Authentication failed: Token is empty');
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      sendError(res, 401, 'Access token has expired. Please refresh your token.');
      return;
    }
    sendError(res, 401, 'Authentication failed: Invalid token');
  }
};
