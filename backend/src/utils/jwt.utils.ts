import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { JwtPayload } from '../types/express';

/**
 * Generates a short-lived access JWT token.
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwtAccessExpiresIn as any,
  };
  return jwt.sign(payload, config.jwtAccessSecret, options);
};

/**
 * Generates a long-lived refresh JWT token.
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwtRefreshExpiresIn as any,
  };
  return jwt.sign(payload, config.jwtRefreshSecret, options);
};

/**
 * Verifies an access token and returns decoded payload.
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtAccessSecret) as JwtPayload;
};

/**
 * Verifies a refresh token and returns decoded payload.
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
};
