// src/routes/api/deleteFragment.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    await Fragment.delete(req.user, id);
    res.status(204).end();
  } catch (err) {
    logger.error('Error deleting fragment', { error: err.message, stack: err.stack });
    res.status(500).json({
      status: 'error',
      error: 'Unable to delete fragment',
    });
  }
};
