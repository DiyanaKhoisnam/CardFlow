"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const response_utils_1 = require("../utils/response.utils");
const authenticateJwt = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, response_utils_1.sendError)(res, 401, 'Authentication failed: No bearer token provided');
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            (0, response_utils_1.sendError)(res, 401, 'Authentication failed: Token is empty');
            return;
        }
        const decoded = (0, jwt_utils_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            (0, response_utils_1.sendError)(res, 401, 'Access token has expired. Please refresh your token.');
            return;
        }
        (0, response_utils_1.sendError)(res, 401, 'Authentication failed: Invalid token');
    }
};
exports.authenticateJwt = authenticateJwt;
