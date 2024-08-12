// src/routes/api/delete.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const hash = require('../../hash');
const logger = require('../../logger');

module.exports = async (req, res) => {
  var id = req.params.id;
  try {
    await Fragment.delete(hash(req.user), id);
    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
      })
    );
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
