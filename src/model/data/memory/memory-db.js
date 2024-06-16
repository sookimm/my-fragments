// src/model/data/memory/memory-db.js

const fragments = {};
const logger = require('../../../logger');

const readFragment = async (ownerId, id) => {
  logger.debug(`Reading fragment: ${ownerId}/${id}`);
  return fragments[`${ownerId}/${id}`] || null;
};

const writeFragment = async (ownerId, fragment) => {
  logger.debug(`Writing fragment: ${ownerId}/${fragment.id}`);
  fragments[`${ownerId}/${fragment.id}`] = { ...fragment };
  return fragment;
};

const readFragmentData = async (ownerId, id) => {
  logger.debug(`Reading fragment data: ${ownerId}/${id}`);
  const fragment = await readFragment(ownerId, id);
  return fragment ? fragment.data : null;
};

const writeFragmentData = async (ownerId, id, data) => {
  logger.debug(`Writing fragment data: ${ownerId}/${id}`);
  const fragment = await readFragment(ownerId, id);
  if (fragment) {
    fragment.data = data;
    await writeFragment(ownerId, fragment);
  }
};

module.exports = {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
};
