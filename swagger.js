const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User App Authentication API',
      version: '1.0.0',
      description: 'API documentation for User App Authentication Service',
      contact: {
        name: 'Firebase Authentication System',
        email: 'your-email@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./Router/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
