// src/routes/api/put.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const hash = require('../../hash');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(hash(req.user), req.params.id);
    if (fragment.type.includes(req.get('Content-Type'))) {
      await fragment.setData(req.body);
      logger.info(fragment.type);
      res.setHeader('Content-type', req.get('Content-Type'));
      res.status(200).json(
        createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    } else {
      res.status(400).json(createErrorResponse(400, "Type doesn't match"));
    }
  } catch (err) {
    logger.info(err);
    res.status(404).json(createErrorResponse(404, 'Fragment Not Found'));
  }
};
