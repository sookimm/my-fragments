// src/auth/auth-middleware.js

const { hashEmail } = require('../hash');

function authorize(strategy) {
  return (req, res, next) => {
    if (req.user) {
      req.user = hashEmail(req.user);
    }
    next();
  };
}

module.exports = authorize;
