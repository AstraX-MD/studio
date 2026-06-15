/**
 * @fileOverview Local JSON file storage. Best for development or low-scale bots.
 */
import fs from 'fs';
import path from 'path';

export default class JSONProvider {
  constructor(bot) {
    this.bot = bot;
    this.dbDir = path.resolve('./database');
    this.cache = new Map();
  }

  async init() {
    if (!fs.existsSync(this.dbDir)) fs.mkdirSync(this.dbDir, { recursive: true });
  }

  _getPath(collection) {
    return path.join(this.dbDir, `${collection}.json`);
  }

  async _load(collection) {
    const filePath = this._getPath(collection);
    if (!fs.existsSync(filePath)) return {};
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }

  async _save(collection, data) {
    const filePath = this._getPath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  async get(collection, key) {
    const data = await this._load(collection);
    return data[key];
  }

  async set(collection, key, value) {
    const data = await this._load(collection);
    data[key] = value;
    await this._save(collection, data);
  }

  async delete(collection, key) {
    const data = await this._load(collection);
    delete data[key];
    await this._save(collection, data);
  }

  async has(collection, key) {
    const data = await this._load(collection);
    return Object.prototype.hasOwnProperty.call(data, key);
  }

  async all(collection) {
    return this._load(collection);
  }
}
