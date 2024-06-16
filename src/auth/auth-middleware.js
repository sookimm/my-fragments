// src/auth/auth-middleware.js

const passport = require('passport');
const logger = require('../logger');

const authorize = (type) => (req, res, next) => {
  passport.authenticate(type, { session: false }, (err, user) => {
    if (err || !user) {
      logger.warn('Unauthorized access attempt');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    logger.info('User authenticated', { user });
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authorize;
