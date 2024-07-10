// src/auth/index.js

const logger = require('../logger');

const hasCognitoConfig = process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID;
const hasBasicAuthConfig = process.env.HTPASSWD_FILE && process.env.NODE_ENV !== 'production';

if (hasCognitoConfig) {
  logger.info('Using Cognito authentication');
  module.exports = require('./cognito');
} else if (hasBasicAuthConfig) {
  logger.info('Using Basic Auth authentication');
  module.exports = require('./basic-auth');
} else {
  logger.error(
    'missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID or HTPASSWD_FILE'
  );
  throw new Error(
    'missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID or HTPASSWD_FILE'
  );
}
