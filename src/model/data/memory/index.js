// src/model/data/memory/index.js

const memoryDB = require('./memory-db');

module.exports = {
  readFragment: (ownerId, id) => memoryDB.readFragment(ownerId, id),
  writeFragment: (ownerId, id, fragment) => memoryDB.writeFragment(ownerId, id, fragment),
  readFragmentData: (ownerId, id) => memoryDB.readFragmentData(ownerId, id),
  writeFragmentData: (ownerId, id, data) => memoryDB.writeFragmentData(ownerId, id, data),
};
