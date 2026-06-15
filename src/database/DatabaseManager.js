/**
 * @fileOverview Orchestrates database operations with MongoDB priority and JSON/RAM fallback.
 * Fixed: Removed bot.logger dependency to prevent boot failures.
 */
export default class DatabaseManager {
  constructor(bot) {
    this.bot = bot;
    this.provider = null;
    this.activeProviderName = process.env.DATABASE_TYPE || 'mongodb';
  }

  /**
   * Initializes the database. Tries Mongo -> JSON -> RAM.
   */
  async init() {
    console.log(`\n==> DATABASE: Initializing [${this.activeProviderName.toUpperCase()}] Layer...`);
    
    try {
      if (this.activeProviderName === 'mongodb' && !process.env.MONGODB_URL) {
        throw new Error('MONGODB_URL missing in environment.');
      }
      
      await this._loadProvider(this.activeProviderName);
    } catch (error) {
      console.log(`==> DATABASE: Primary [${this.activeProviderName}] failed. Falling back...`);
      try {
        await this._loadProvider('json');
      } catch (e) {
        console.log('==> DATABASE: Falling back to RAM mode...');
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
    console.log(`==> DATABASE: Status: ACTIVE [${name.toUpperCase()}]\n`);
  }

  // Unified API
  async get(collection, key) {
    return this.provider.get(collection, key);
  }

  async set(collection, key, value) {
    return this.provider.set(collection, key, value);
  }

  async delete(collection, key) {
    return this.provider.delete(collection, key);
  }

  async has(collection, key) {
    return this.provider.has(collection, key);
  }

  async all(collection) {
    return this.provider.all(collection);
  }
}
