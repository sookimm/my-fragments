// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const hash = require('../../hash');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    res.status(200).json({
      status: 'ok',
      fragments: await Fragment.byUser(hash(req.user), req.query.expand == 1),
    });
  } catch (err) {
    res.status(401).json(createErrorResponse(401, err));
  }
};
