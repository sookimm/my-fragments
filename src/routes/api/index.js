// src/routes/api/index.js

const express = require('express');
const { rawBody, postFragment } = require('./post');
const logger = require('../../logger');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our routes
router.get('/fragments', require('./get'));
router.get('/fragments/:id', require('./getFragment'));
router.post('/fragments', rawBody(), postFragment);
router.delete('/fragments/:id', require('./deleteFragment')); // DELETE route

logger.info('API routes set up');

module.exports = router;
