// src/routes/api/getById.js

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const mime = require('mime-types');
const hash = require('../../hash');

module.exports = async (req, res) => {
  var id = req.params.id;
  var extension = mime.lookup(id);
  if (req.params.id.includes('.')) {
    id = req.params.id.split('.').slice(0, -1).join('.');
  }
  try {
    const fragment = await Fragment.byId(hash(req.user), id);
    var fragmentData = await fragment.getData();
    var type;
    try {
      if (fragment.formats.includes(extension)) {
        type = extension;
      } else if (extension == false) {
        type = fragment.mimeType;
      }
      var data = await fragment.convertData(fragmentData, type);
      res.setHeader('Content-type', type);
      res.status(200).json(data);
    } catch (err) {
      console.error('An error occurred:', err.message);
      res
        .status(415)
        .json(createErrorResponse(415, 'The fragment cannot be converted to this type'));
    }
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
