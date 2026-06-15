/**
 * @fileOverview MySQL provider.
 */
export default class MySQLProvider {
  constructor(bot) {
    this.bot = bot;
  }

  async init() {
    console.log('==> DATABASE: MySQL Provider initialization skip (Stub)');
  }

  async get(collection, key) { return null; }
  async set(collection, key, value) { return; }
  async delete(collection, key) { return; }
  async has(collection, key) { return false; }
  async all(collection) { return {}; }
}
