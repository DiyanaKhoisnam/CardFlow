import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`🚀 [Server]: Credit Card Management API server running at http://localhost:${config.port}`);
  console.log(`🌐 [Environment]: ${config.nodeEnv}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error(' [Unhandled Rejection]:', err.message);
  server.close(() => process.exit(1));
});
