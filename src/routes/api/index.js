// src/routes/api/index.js

const express = require('express');
const { rawBody, postFragment } = require('./post');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our routes
router.get('/fragments', require('./get'));
router.post('/fragments', rawBody(), postFragment);

module.exports = router;
