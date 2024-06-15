// src/model/fragment.js

class Fragment {
  constructor({ id, ownerId, data }) {
    this.id = id;
    this.ownerId = ownerId;
    this.data = data;
  }

  async save() {
    // Implement logic to save fragments to database
    // Assuming we use a memory database
    fragments[`${this.ownerId}/${this.id}`] = this;
    console.log('Fragment saved:', this);
  }

  static async read(id, ownerId) {
    return fragments[`${ownerId}/${id}`] || null;
  }

  async getData() {
    return this.data;
  }

  async setData(newData) {
    this.data = newData;
    await this.save(); // store date after update
  }

  static isSupportedType(type) {
    // Implement logic to check if the type is supported
    return ['text/plain', 'application/json'].includes(type);
  }
}

// Temporary memory database
const fragments = {};

module.exports = Fragment;
