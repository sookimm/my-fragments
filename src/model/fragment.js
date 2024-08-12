// src/model/fragment.js

const { randomUUID } = require('crypto');
const contentType = require('content-type');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data/index');

const sharp = require('sharp');

class Fragment {
  constructor({ id, ownerId, created = new Date(), updated = new Date(), type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error('ownerId and type are required');
    }
    if (size < 0 || typeof size != 'number') {
      throw new Error('size should be a number and greater than 0');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error('Not Supported Type');
    }
    this.id = id || randomUUID();
    this.created = created;
    this.updated = updated;
    this.ownerId = ownerId;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error('Fragment not found');
    }
    return new Fragment(fragment);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('data is not a Buffer');
    }
    this.size = Buffer.byteLength(data);
    await this.save();
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (/(text\/)+/.test(this.mimeType)) {
      return true;
    }
    return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const plainCon = ['text/plain'];
    const mdCon = ['text/plain', 'text/markdown', 'text/html'];
    const htmlCon = ['text/html', 'text/plain'];
    const jsonCon = ['application/json', 'text/plain'];
    const imgCon = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    switch (this.mimeType) {
      case 'text/plain':
        return plainCon;
      case 'text/markdown':
        return mdCon;
      case 'text/html':
        return htmlCon;
      case 'application/json':
        return jsonCon;
      case 'image/png':
        return imgCon;
      case 'image/jpeg':
        return imgCon;
      case 'image/gif':
        return imgCon;
      case 'image/webp':
        return imgCon;
      default:
        return [this.mimeType];
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */

  static isSupportedType(value) {
    if (
      value === 'text/plain' ||
      value === 'text/plain; charset=utf-8' ||
      value === 'text/markdown' ||
      value === 'text/html' ||
      value === 'application/json' ||
      value === 'image/png' ||
      value === 'image/jpeg' ||
      value === 'image/webp' ||
      value === 'image/gif'
    ) {
      return true;
    }
    return false;
  }

  async convertData(data, type) {
    switch (type) {
      case 'text/plain':
        return data.toString();
      case 'text/html':
        if (this.type == 'text/markdown') {
          return md.render(data.toString());
        }
        return data.toString();
      case 'text/markdown':
        return data.toString();
      case 'application/json':
        return JSON.parse(data.toString());
      case 'image/png':
        return await sharp(data, { failOnError: false }).png().toBuffer();
      case 'image/jpeg':
        return await sharp(data, { failOnError: false }).jpeg().toBuffer();
      case 'image/gif':
        return await sharp(data, { failOnError: false }).gif().toBuffer();
      case 'image/webp':
        return await sharp(data, { failOnError: false }).webp().toBuffer();
      default:
        return data;
    }
  }
}

module.exports.Fragment = Fragment;
