// src/auth/index.js

const logger = require('../logger');

if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  logger.info('Using Cognito authentication');
  module.exports = require('./cognito');
} else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  logger.info('Using Basic Auth authentication');
  module.exports = require('./basic-auth');
} else {
  logger.error('missing env vars: no authorization configuration found');
  throw new Error('missing env vars: no authorization configuration found');
}
