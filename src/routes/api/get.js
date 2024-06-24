// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    logger.info('Fetching fragments for user', { user: req.user });
    const fragments = await Fragment.byUser(req.user);
    res.status(200).json({
      status: 'ok',
      fragments,
    });
  } catch (err) {
    logger.error('Error fetching fragments for user', { error: err.message });
    res.status(500).json({
      status: 'error',
      error: 'Unable to fetch fragments',
    });
  }
};
