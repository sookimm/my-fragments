// src/routes/api/index.js

const express = require('express');
const { rawBody, postFragment } = require('./post');
const logger = require('../../logger');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our routes
router.get('/fragments', require('./get'));
router.get('/fragments/:id', require('./getFragment')); // 새로운 라우트 추가
router.post('/fragments', rawBody(), postFragment);

logger.info('API routes set up');

module.exports = router;
