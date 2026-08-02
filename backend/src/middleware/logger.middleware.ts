import morgan from 'morgan';
import { config } from '../config/env';

// HTTP Morgan Logger configuration
export const httpLogger = morgan(
  config.nodeEnv === 'development'
    ? ':method :url :status :response-time ms - :res[content-length]'
    : 'combined'
);
