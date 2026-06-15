/**
 * @fileOverview Orchestrates database operations with MongoDB priority and JSON/RAM fallback.
 * Fixed: Removed all bot.logger references to prevent boot failures.
 */
export default class DatabaseManager {
  constructor(bot) {
    this.bot = bot;
    this.provider = null;
    this.activeProviderName = process.env.DATABASE_TYPE || 'mongodb';
  }

  /**
   * Initializes the database safely.
   */
  async init() {
    try {
      if (this.activeProviderName === 'mongodb' && !process.env.MONGODB_URL) {
        throw new Error('MONGODB_URL missing');
      }
      await this._loadProvider(this.activeProviderName);
    } catch (error) {
      try {
        await this._loadProvider('json');
      } catch (e) {
        await this._loadProvider('ram');
      }
    }
  }

  async _loadProvider(name) {
    const providerPath = `./providers/${name.charAt(0).toUpperCase() + name.slice(1)}Provider.js`;
    const { default: Provider } = await import(providerPath);
    
    this.provider = new Provider(this.bot);
    await this.provider.init();
    this.activeProviderName = name;
    console.log(`==> DATABASE: Active Layer [${name.toUpperCase()}]`);
  }

  async get(collection, key) {
    if (!this.provider) return null;
    return this.provider.get(collection, key);
  }

  async set(collection, key, value) {
    if (!this.provider) return;
    return this.provider.set(collection, key, value);
  }

  async delete(collection, key) {
    if (!this.provider) return;
    return this.provider.delete(collection, key);
  }

  async has(collection, key) {
    if (!this.provider) return false;
    return this.provider.has(collection, key);
  }

  async all(collection) {
    if (!this.provider) return {};
    return this.provider.all(collection);
  }
}