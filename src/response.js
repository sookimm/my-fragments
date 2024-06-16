// src/response.js

const logger = require('./logger');

// Function to create a success response
const createSuccessResponse = (res, data = {}) => {
  res.status(200).json({
    status: 'ok',
    ...data,
  });
  logger.info('Success response created', { data });
};

// Function to create an error response
const createErrorResponse = (res, message, code = 500) => {
  res.status(code).json({
    status: 'error',
    error: {
      message,
      code,
    },
  });
  logger.error('Error response created', { message, code });
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
};
