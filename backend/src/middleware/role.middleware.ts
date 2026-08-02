import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { sendError } from '../utils/response.utils';

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Authentication required before authorization check');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        403,
        `Access denied: Your role (${req.user.role}) does not have permission to access this resource`
      );
      return;
    }

    next();
  };
};
