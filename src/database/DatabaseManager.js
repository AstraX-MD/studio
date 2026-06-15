/**
 * @fileOverview Orchestrates database operations with MongoDB priority and RAM fallback.
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
    this.bot.logger.info(`Initializing Database Layer: [${this.activeProviderName.toUpperCase()}]`);
    
    try {
      if (this.activeProviderName === 'mongodb' && !process.env.MONGODB_URL) {
        throw new Error('MONGODB_URL missing in environment.');
      }

      await this._loadProvider(this.activeProviderName);
    } catch (error) {
      this.bot.logger.warn(`Primary Provider [${this.activeProviderName}] failed: ${error.message}`);
      this.bot.logger.info('Falling back to RAM mode...');
      await this._loadProvider('ram');
    }
  }

  async _loadProvider(name) {
    const providerPath = `./providers/${name.charAt(0).toUpperCase() + name.slice(1)}Provider.js`;
    const { default: Provider } = await import(providerPath);
    
    this.provider = new Provider(this.bot);
    await this.provider.init();
    this.activeProviderName = name;
    this.bot.logger.info(`Database Active: [${name.toUpperCase()}]`);
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