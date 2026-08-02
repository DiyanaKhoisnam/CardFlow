"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, statusCode, message, data) => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, message, error) => {
    const response = {
        success: false,
        message,
        error,
    };
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
