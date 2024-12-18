// src/index.js

// Read environment variables from an .env file (if present)
require('dotenv').config();

// Log any crash cases so we can debug later from logs.
const logger = require('./logger');

const app = require('./app'); // Ensure 'app' is used

// Log the app instance
logger.info({ app }, 'App instance loaded');

// If going to crash because of an uncaught exception, log it first.
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

// If going to crash because of an unhandled promise rejection, log it first.
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

// Start our server
require('./server');
