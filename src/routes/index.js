// src/routes/index.js

const express = require('express');
const { hostname } = require('os');
const { createSuccessResponse } = require('../response');

// version and author from package.json
const { version, author } = require('../../package.json');

// Authorization middleware
const { authenticate } = require('../auth');

// Router to mount our API
const router = express.Router();

// Expose all of our API routes on /v1/* to include an API version.
router.use(`/v1`, authenticate(), require('./api'));

// health check route
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author,
      githubUrl: 'https://github.com/sookimm/fragments',
      version,
      // Include the hostname in the response
      hostname: hostname(),
    })
  );
});

module.exports = router;
