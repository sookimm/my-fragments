// src/model/fragment.js

const logger = require('../logger');

class Fragment {
  constructor({ id, ownerId, data }) {
    this.id = id;
    this.ownerId = ownerId;
    this.data = data;
    logger.info('Fragment instance created', { id, ownerId });
  }

  async save() {
    logger.debug('Saving fragment', { id: this.id, ownerId: this.ownerId });
    fragments[`${this.ownerId}/${this.id}`] = this;
    logger.info('Fragment saved', { id: this.id, ownerId: this.ownerId });
  }

  static async read(id, ownerId) {
    logger.debug('Reading fragment', { id, ownerId });
    return fragments[`${ownerId}/${id}`] || null;
  }

  async getData() {
    logger.debug('Getting fragment data', { id: this.id, ownerId: this.ownerId });
    return this.data;
  }

  async setData(newData) {
    logger.debug('Setting fragment data', { id: this.id, ownerId: this.ownerId });
    this.data = newData;
    await this.save();
  }

  static isSupportedType(type) {
    const supported = ['text/plain', 'application/json'].includes(type);
    logger.debug('Checking if type is supported', { type, supported });
    return supported;
  }
}

// Temporary memory database
const fragments = {};

module.exports = Fragment;
