import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config/env';
import { httpLogger } from './middleware/logger.middleware';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.middleware';
import { setupSwagger } from './utils/swagger';
import authRoutes from './routes/auth.routes';
import cardRoutes from './routes/card.routes';
import transactionRoutes from './routes/transaction.routes';
import rewardRoutes from './routes/reward.routes';
import customerRoutes from './routes/customer.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/error.middleware';
import { sendSuccess } from './utils/response.utils';

const app: Application = express();

// Security HTTP Headers & Request Logging
app.use(helmet());
app.use(httpLogger);

// Global Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup allowing credentials & configured frontend origin
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Apply Rate Limiter to all API routes
app.use('/api/v1', apiLimiter);

// Setup Swagger OpenApi Documentation UI at /api-docs
setupSwagger(app);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  sendSuccess(res, 200, 'Credit Card Management API Service is operational', {
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// API V1 Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/cards', cardRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/customer', customerRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
