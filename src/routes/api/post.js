// src/routes/api/post.js

const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

// rawBody middleware
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      const supported = Fragment.isSupportedType(type);
      logger.debug('Parsing request content type', { type, supported });
      return supported;
    },
  });

// postFragment route handler
const postFragment = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    logger.warn('Invalid content type');
    return res.status(400).json({ error: 'Invalid content type' });
  }

  try {
    logger.debug('Creating new fragment', { user: req.user, type: req.headers['content-type'] });
    const fragment = new Fragment({
      ownerId: req.user || 'test-user',
      type: req.headers['content-type'],
      size: req.body.length,
    });
    await fragment.save();
    logger.debug('Fragment metadata saved', { fragment });
    await fragment.setData(req.body);
    logger.debug('Fragment data saved', { fragmentId: fragment.id });
    const location = new URL(
      `/v1/fragments/${fragment.id}`,
      process.env.API_URL || `http://${req.headers.host}`
    );
    res.setHeader('Location', location.toString());
    logger.info('Fragment created', { id: fragment.id, ownerId: fragment.ownerId });
    res.status(201).json({ fragment });
  } catch (err) {
    logger.error('Unable to save fragment', { error: err.message, stack: err.stack }); // 에러 로그 추가
    res.status(500).json({ error: 'Unable to save fragment', details: err.message });
  }
};

module.exports = {
  rawBody,
  postFragment,
};
