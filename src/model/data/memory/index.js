// src/model/data/memory/index.js

const MemoryDB = require('./memory-db');

// Create two in-memory databases: one for fragment metadata and the other for raw data
const data = new MemoryDB();
const metadata = new MemoryDB();

// Write a fragment's metadata to memory db. Returns a Promise
function writeFragment(ownerId, id, fragment) {
  return metadata.put(ownerId, id, fragment).then(() => fragment);
}

// Read a fragment's metadata from memory db. Returns a Promise
function readFragment(ownerId, id) {
  return metadata.get(ownerId, id);
}

// Write a fragment's data buffer to memory db. Returns a Promise
function writeFragmentData(ownerId, id, buffer) {
  return data.put(ownerId, id, buffer);
}

// Read a fragment's data from memory db. Returns a Promise
function readFragmentData(ownerId, id) {
  return data.get(ownerId, id);
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
async function listFragments(ownerId, expand = false) {
  try {
    console.log(`Listing fragments for user ${ownerId} with expand: ${expand}`); // Add debugging log
    const fragments = await metadata.query(ownerId);
    console.log('Fragments in memory:', fragments); // Add debugging log

    // If we don't get anything back, or are supposed to give expanded fragments, return
    if (expand || !fragments) {
      return fragments;
    }

    // Otherwise, map to only send back the ids
    return fragments.map((fragment) => {
      console.log(
        `Fragment id: ${fragment.id}, ownerId: ${fragment.ownerId}, type: ${fragment.type}`
      );
      return {
        id: fragment.id,
        ownerId: fragment.ownerId,
        type: fragment.type,
      };
    });
  } catch (err) {
    console.error('Error in listFragments method:', err); // Add error log
    throw new Error('Error listing fragments');
  }
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

module.exports = {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};
