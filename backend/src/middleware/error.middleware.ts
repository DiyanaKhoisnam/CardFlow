import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';
import { config } from '../config/env';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (config.nodeEnv === 'development') {
    console.error(' [Unhandled Error]:', err);
  }

  sendError(
    res,
    statusCode,
    message,
    config.nodeEnv === 'development' ? { stack: err.stack } : undefined
  );
};
