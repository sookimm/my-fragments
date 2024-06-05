// src/response.js

// Function to create a success response
const createSuccessResponse = (res, data = {}) => {
  res.status(200).json({
    status: 'ok',
    ...data,
  });
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
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
};
