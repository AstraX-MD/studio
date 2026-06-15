/**
 * @fileOverview In-memory RAM storage. Volatile fallback to prevent crashes.
 */
export default class RamProvider {
  constructor(bot) {
    this.bot = bot;
    this.store = new Map();
  }

  async init() {
    this.bot.logger.warn('RAM Provider active. Data will NOT persist after restart.');
  }

  _getKey(coll, key) {
    return `${coll}:${key}`;
  }

  async get(coll, key) {
    return this.store.get(this._getKey(coll, key)) || null;
  }

  async set(coll, key, value) {
    this.store.set(this._getKey(coll, key), value);
  }

  async delete(coll, key) {
    this.store.delete(this._getKey(coll, key));
  }

  async has(coll, key) {
    return this.store.has(this._getKey(coll, key));
  }

  async all(coll) {
    const results = {};
    for (const [k, v] of this.store.entries()) {
      if (k.startsWith(`${coll}:`)) {
        results[k.split(':')[1]] = v;
      }
    }
    return results;
  }
}