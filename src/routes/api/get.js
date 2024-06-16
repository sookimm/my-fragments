// src/routes/api/get.js

const logger = require('../../logger');

module.exports = (req, res) => {
  logger.info('Fetching fragments for user', { user: req.user });
  res.status(200).json({
    status: 'ok',
    fragments: [],
  });
};
