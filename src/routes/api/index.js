// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our routes
router.get('/fragments', require('./get'));
router.post('/fragments', require('./post'));

module.exports = router;
