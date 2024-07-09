// src/routes/api/getFragment.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const fragment = await Fragment.byId(req.user, id);
    res.status(200).json({
      status: 'ok',
      fragment,
    });
  } catch (err) {
    logger.error('Error fetching fragment', { error: err.message });
    res.status(500).json({
      status: 'error',
      error: 'Unable to fetch fragment',
    });
  }
};
