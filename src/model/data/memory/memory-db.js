// src/model/data/memory/memory-db.js

const fragments = {};

const readFragment = async (ownerId, id) => {
  return fragments[`${ownerId}/${id}`] || null;
};

const writeFragment = async (ownerId, fragment) => {
  fragments[`${ownerId}/${fragment.id}`] = { ...fragment };
  return fragment;
};

const readFragmentData = async (ownerId, id) => {
  const fragment = await readFragment(ownerId, id);
  return fragment ? fragment.data : null;
};

const writeFragmentData = async (ownerId, id, data) => {
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
