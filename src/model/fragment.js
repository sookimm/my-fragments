// src/model/fragment.js

const { randomUUID } = require('crypto');
const contentType = require('content-type');
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error('ownerId and type are required');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;

    if (size < 0) {
      throw new Error('size must be 0 or greater');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error(`unsupported type: ${type}`);
    }
  }

  static async byUser(ownerId, expand = false) {
    try {
      const fragments = await listFragments(ownerId, expand);
      return fragments.map((f) => new Fragment(f));
    } catch (err) {
      console.error('Error in byUser method:', err); // Add error log
      throw new Error('Error fetching fragments by user');
    }
  }

  static async byId(ownerId, id) {
    try {
      const fragment = await readFragment(ownerId, id);
      if (!fragment) {
        throw new Error('fragment not found');
      }
      return new Fragment(fragment);
    } catch (err) {
      console.error('Error in byId method:', err); // Add error log
      if (err.message === 'fragment not found') {
        throw err;
      }
      throw new Error('Error fetching fragment by id');
    }
  }

  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  async save() {
    this.updated = new Date().toISOString();
    await writeFragment(this.ownerId, this.id, this);
  }

  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('data must be a Buffer');
    }
    this.size = data.length;
    await writeFragmentData(this.ownerId, this.id, data);
    await this.save();
  }

  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  get isText() {
    return this.mimeType.startsWith('text/');
  }

  get formats() {
    return [this.type];
  }

  static isSupportedType(value) {
    const { type } = contentType.parse(value);
    return ['text/plain', 'application/json'].includes(type);
  }
}

module.exports = { Fragment };
