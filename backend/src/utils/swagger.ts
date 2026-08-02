import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { config } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CardFlow REST API',
      version: '1.0.0',
      description:
        'Enterprise full-stack API supporting user authentication, credit card lifecycle controls, paginated transaction ledgers, rewards catalog, and role-based admin command center.',
      contact: {
        name: 'CardFlow Engineering Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📚 [Swagger]: Interactive API documentation ready at http://localhost:${config.port}/api-docs`);
};
