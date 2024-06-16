// src/model/data/memory/index.js

const memoryDB = require('./memory-db');
const logger = require('../../../logger');

module.exports = {
  readFragment: async (ownerId, id) => {
    logger.debug(`Reading fragment: ${ownerId}/${id}`);
    return memoryDB.readFragment(ownerId, id);
  },
  writeFragment: async (ownerId, id, fragment) => {
    logger.debug(`Writing fragment: ${ownerId}/${id}`);
    return memoryDB.writeFragment(ownerId, id, fragment);
  },
  readFragmentData: async (ownerId, id) => {
    logger.debug(`Reading fragment data: ${ownerId}/${id}`);
    return memoryDB.readFragmentData(ownerId, id);
  },
  writeFragmentData: async (ownerId, id, data) => {
    logger.debug(`Writing fragment data: ${ownerId}/${id}`);
    return memoryDB.writeFragmentData(ownerId, id, data);
  },
};
