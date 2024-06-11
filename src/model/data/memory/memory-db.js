// src/model/data/memory/memory-db.js

class MemoryDB {
  constructor() {
    this.fragments = new Map();
  }

  async writeFragment(ownerId, id, fragment) {
    const key = `${ownerId}-${id}`;
    this.fragments.set(key, fragment);
  }

  async readFragment(ownerId, id) {
    const key = `${ownerId}-${id}`;
    return this.fragments.get(key);
  }

  async writeFragmentData(ownerId, id, data) {
    const key = `${ownerId}-${id}-data`;
    this.fragments.set(key, data);
  }

  async readFragmentData(ownerId, id) {
    const key = `${ownerId}-${id}-data`;
    return this.fragments.get(key);
  }
}

module.exports = new MemoryDB();
