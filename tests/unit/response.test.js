// tests/unit/response.test.js

const { createErrorResponse, createSuccessResponse } = require('../../src/response');

// Define (i.e., name) the set of tests we're about to do
describe('API Responses', () => {
  // Write a test for calling createErrorResponse()
  test('createErrorResponse()', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const status = 404;
    const message = 'not found';

    createErrorResponse(res, message, status);

    // Expect the response to look like the following
    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: status,
        message,
      },
    });
  });

  // Write a test for calling createSuccessResponse() with no argument
  test('createSuccessResponse()', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    createSuccessResponse(res);

    // Expect the response to look like the following
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
    });
  });

  // Write a test for calling createSuccessResponse() with an argument
  test('createSuccessResponse(data)', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const data = { a: 1, b: 2 };

    createSuccessResponse(res, data);

    // Expect the response to look like the following
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      a: 1,
      b: 2,
    });
  });
});
