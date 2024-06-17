// src/model/data/memory/memory-db.js

class MemoryDB {
  constructor() {
    /** @type {Record<string, any>} */
    this.db = {};
  }

  async get(primaryKey, secondaryKey) {
    if (typeof primaryKey !== 'string' || typeof secondaryKey !== 'string') {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    return this.db[primaryKey] && this.db[primaryKey][secondaryKey];
  }

  async put(primaryKey, secondaryKey, value) {
    if (typeof primaryKey !== 'string' || typeof secondaryKey !== 'string') {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    this.db[primaryKey] = this.db[primaryKey] || {};
    this.db[primaryKey][secondaryKey] = value;
  }

  async query(primaryKey) {
    if (typeof primaryKey !== 'string') {
      throw new Error(`primaryKey string is required, got primaryKey=${primaryKey}`);
    }
    return Object.values(this.db[primaryKey] || {});
  }

  async del(primaryKey, secondaryKey) {
    if (typeof primaryKey !== 'string' || typeof secondaryKey !== 'string') {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    if (!this.db[primaryKey] || !this.db[primaryKey][secondaryKey]) {
      throw new Error(
        `missing entry for primaryKey=${primaryKey} and secondaryKey=${secondaryKey}`
      );
    }
    delete this.db[primaryKey][secondaryKey];
  }
}

module.exports = MemoryDB;
