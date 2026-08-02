"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
/**
 * Generates a short-lived access JWT token.
 */
const generateAccessToken = (payload) => {
    const options = {
        expiresIn: env_1.config.jwtAccessExpiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwtAccessSecret, options);
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generates a long-lived refresh JWT token.
 */
const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: env_1.config.jwtRefreshExpiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwtRefreshSecret, options);
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verifies an access token and returns decoded payload.
 */
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.config.jwtAccessSecret);
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verifies a refresh token and returns decoded payload.
 */
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.config.jwtRefreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
