"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const response_utils_1 = require("../utils/response.utils");
const env_1 = require("../config/env");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    if (env_1.config.nodeEnv === 'development') {
        console.error(' [Unhandled Error]:', err);
    }
    (0, response_utils_1.sendError)(res, statusCode, message, env_1.config.nodeEnv === 'development' ? { stack: err.stack } : undefined);
};
exports.errorHandler = errorHandler;
