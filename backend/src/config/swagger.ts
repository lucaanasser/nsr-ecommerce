import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'NSR E-commerce API',
    version: '1.0.0',
    description: 'Backend REST API documentation for NSR E-commerce platform',
    contact: {
      name: 'Luca Anasser',
      email: 'contato@nsr.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: 'Development server',
    },
    {
      url: 'https://api.nsr.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Auth',
      description: 'Authentication and authorization',
    },
    {
      name: 'Products',
      description: 'Product management',
    },
    {
      name: 'Cart',
      description: 'Shopping cart operations',
    },
    {
      name: 'Orders',
      description: 'Order management',
    },
    {
      name: 'Admin',
      description: 'Admin panel endpoints',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'BadRequestError',
          },
          message: {
            type: 'string',
            example: 'Invalid input data',
          },
          statusCode: {
            type: 'number',
            example: 400,
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
          path: {
            type: 'string',
            example: '/api/v1/products',
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'ValidationError',
          },
          message: {
            type: 'string',
            example: 'Validation failed',
          },
          statusCode: {
            type: 'number',
            example: 422,
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
          path: {
            type: 'string',
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'email',
                },
                message: {
                  type: 'string',
                  example: 'Invalid email format',
                },
              },
            },
          },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
