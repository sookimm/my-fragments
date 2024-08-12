const MemoryDB = require('./memory-db');

// Two in-memory databases: fragment metadata and raw data
const data = new MemoryDB();
const metadata = new MemoryDB();

function writeFragment(fragment) {
  return metadata.put(fragment.ownerId, fragment.id, fragment);
}

function readFragment(ownerId, id) {
  return metadata.get(ownerId, id);
}

function writeFragmentData(ownerId, id, value) {
  return data.put(ownerId, id, value);
}

function readFragmentData(ownerId, id) {
  return data.get(ownerId, id);
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
async function listFragments(ownerId, expand = false) {
  const fragments = await metadata.query(ownerId);

  // If we don't get anything back, or are supposed to give expanded fragments, return
  if (expand || !fragments) {
    return fragments;
  }

  // Otherwise, map to only send back the ids
  return fragments.map((fragment) => fragment.id);
}

// Delete a fragment's metadata and data from memory db. Returns a Promise
function deleteFragment(ownerId, id) {
  return Promise.all([
    // Delete metadata
    metadata.del(ownerId, id),
    // Delete data
    data.del(ownerId, id),
  ]);
}

module.exports.listFragments = listFragments;
module.exports.writeFragment = writeFragment;
module.exports.readFragment = readFragment;
module.exports.writeFragmentData = writeFragmentData;
module.exports.readFragmentData = readFragmentData;
module.exports.deleteFragment = deleteFragment;
