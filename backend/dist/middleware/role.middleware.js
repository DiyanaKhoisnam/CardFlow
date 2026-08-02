"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const response_utils_1 = require("../utils/response.utils");
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_utils_1.sendError)(res, 401, 'Authentication required before authorization check');
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            (0, response_utils_1.sendError)(res, 403, `Access denied: Your role (${req.user.role}) does not have permission to access this resource`);
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
