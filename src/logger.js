// src/logger.js

// Use `info` as standard log level if not specified
const options = { level: process.env.LOG_LEVEL || 'info' };

// If doing `debug` logging, make the logs easier to read
if (options.level === 'debug') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

// For test environment, reduce log verbosity
if (process.env.NODE_ENV === 'test') {
  options.level = 'silent'; // Change this to 'error' or 'warn' if you still want some logs
}

// Create and export a Pino Logger instance:
module.exports = require('pino')(options);
