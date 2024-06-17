// src/hash.js

const crypto = require('crypto');

/**
 * @param {string} email - user's email address
 * @returns {string} - hashed email address
 */
function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

module.exports = hashEmail;
