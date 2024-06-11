// src/model/fragment.js

const { v4: uuidv4 } = require('uuid');
const { writeFragment, readFragment, writeFragmentData, readFragmentData } = require('./data');
const contentType = require('content-type');

class Fragment {
  constructor(ownerId, data, type) {
    if (!Fragment.isSupportedType(type)) {
      throw new Error(`Unsupported type: ${type}`);
    }

    this.id = uuidv4();
    this.ownerId = ownerId;
    this.type = type;
    this.size = data.length;
    this.created = new Date().toISOString();
    this.data = data;
  }

  static isSupportedType(type) {
    const supportedTypes = ['text/plain'];
    return supportedTypes.includes(type);
  }

  async save() {
    await writeFragment(this.ownerId, this.id, this);
    await writeFragmentData(this.ownerId, this.id, this.data);
  }

  async getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  static async find(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error(`Fragment not found: ${ownerId}, ${id}`);
    }
    fragment.data = await readFragmentData(ownerId, id);
    return fragment;
  }
}

module.exports = Fragment;
