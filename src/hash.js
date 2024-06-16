// src/hash.js

const crypto = require('crypto');
const logger = require('./logger');

function hashEmail(email) {
  const hashed = crypto.createHash('sha256').update(email).digest('hex');
  logger.debug('Email hashed', { email, hashed });
  return hashed;
}

module.exports = { hashEmail };
