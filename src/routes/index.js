// src/routes/index.js

const express = require('express');
const { createSuccessResponse } = require('../response');
const logger = require('../logger');
const { version, author } = require('../../package.json');
const { authenticate } = require('../auth');
const router = express.Router();

logger.info('Setting up routes');

router.use(`/v1`, authenticate(), require('./api'));

// Simple health check route
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  createSuccessResponse(res, {
    author,
    // GitHub URL
    githubUrl: 'https://github.com/sookimm/fragments',
    version,
  });
  logger.info('Health check route accessed');
});

module.exports = router;
