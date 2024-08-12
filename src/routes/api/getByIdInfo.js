// src/routes/api/getByIdInfo.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const hash = require('../../hash');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(hash(req.user), req.params.id);
    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
        fragment: fragment,
      })
    );
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};
