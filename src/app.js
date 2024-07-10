// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const authenticate = require('./auth');
const { author, version } = require('../package.json');
const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});

const app = express();

// pino logging middleware
app.use(pino);

// helmetjs security middleware
app.use(helmet());

// CORS middleware so we can make requests across origins
app.use(cors());

// gzip/deflate compression middleware
app.use(compression());

// Passport authentication middleware
passport.use(authenticate.strategy());
app.use(passport.initialize());

if (process.env.NODE_ENV === 'test') {
  app.use((req, res, next) => {
    req.user = 'test-user';
    next();
  });
}

// Simple health check route
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo
  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/sookimm/fragments.git',
    version,
  });
  logger.info('Health check route accessed');
});

app.use('/', require('./routes'));

// 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  logger.warn('404 Not Found', { url: req.originalUrl });
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

app.use((err, req, res) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

// Export our `app` so we can access it in server.js
module.exports = app;
