"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const logger_middleware_1 = require("./middleware/logger.middleware");
const rateLimiter_middleware_1 = require("./middleware/rateLimiter.middleware");
const swagger_1 = require("./utils/swagger");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const card_routes_1 = __importDefault(require("./routes/card.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const reward_routes_1 = __importDefault(require("./routes/reward.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const response_utils_1 = require("./utils/response.utils");
const app = (0, express_1.default)();
// Security HTTP Headers & Request Logging
app.use((0, helmet_1.default)());
app.use(logger_middleware_1.httpLogger);
// Global Middleware Configuration
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// CORS setup allowing credentials & configured frontend origin
app.use((0, cors_1.default)({
    origin: env_1.config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Apply Rate Limiter to all API routes
app.use('/api/v1', rateLimiter_middleware_1.apiLimiter);
// Setup Swagger OpenApi Documentation UI at /api-docs
(0, swagger_1.setupSwagger)(app);
// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    (0, response_utils_1.sendSuccess)(res, 200, 'Credit Card Management API Service is operational', {
        timestamp: new Date().toISOString(),
        env: env_1.config.nodeEnv,
    });
});
// API V1 Routes
app.use('/api/v1/auth', rateLimiter_middleware_1.authLimiter, auth_routes_1.default);
app.use('/api/v1/cards', card_routes_1.default);
app.use('/api/v1/transactions', transaction_routes_1.default);
app.use('/api/v1/rewards', reward_routes_1.default);
app.use('/api/v1/customer', customer_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
// Global Error Handler Middleware
app.use(error_middleware_1.errorHandler);
exports.default = app;
