// src/model/fragment.js

const { readFragment, writeFragment, readFragmentData, writeFragmentData } = require('./data');

class Fragment {
  constructor({ id, ownerId, data }) {
    this.id = id;
    this.ownerId = ownerId;
    this.data = data;
  }

  static async read(id, ownerId) {
    const fragment = await readFragment(ownerId, id);
    if (fragment) {
      return new Fragment(fragment);
    }
    return null;
  }

  async save() {
    await writeFragment(this.ownerId, this);
  }

  async getData() {
    return await readFragmentData(this.ownerId, this.id);
  }

  async setData(data) {
    this.data = data;
    await writeFragmentData(this.ownerId, this.id, data);
  }
}

module.exports = Fragment;
