"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const response_utils_1 = require("../utils/response.utils");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.').replace(/^(body|query|params)\./, ''),
                    message: err.message,
                }));
                const primaryMessage = formattedErrors[0]?.message || 'Validation failed for input data';
                (0, response_utils_1.sendError)(res, 400, primaryMessage, formattedErrors);
                return;
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
