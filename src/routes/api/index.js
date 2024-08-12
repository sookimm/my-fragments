// src/routes/api/index.js

const express = require('express');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');

// Router to mount API endpoints
const router = express.Router();

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// Define the routes
router.get('/fragments', require('./get'));
router.post('/fragments', rawBody(), require('./post'));
router.get('/fragments/:id', require('./getById'));
router.get('/fragments/:id/info', require('./getByIdInfo'));
router.delete('/fragments/:id', require('./delete'));
router.put('/fragments/:id', rawBody(), require('./put'));

module.exports = router;
