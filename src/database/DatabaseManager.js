/**
 * @fileOverview Orchestrates database operations and manages the active provider.
 * This is the only file the rest of the bot communicates with for data.
 */
export default class DatabaseManager {
  constructor(bot) {
    this.bot = bot;
    this.provider = null;
    this.activeProviderName = process.env.DATABASE_TYPE || 'json';
  }

  /**
   * Initializes the selected database provider.
   */
  async init() {
    this.bot.logger.info(`Initializing Database Layer: [${this.activeProviderName.toUpperCase()}]`);
    
    try {
      const providerPath = `./providers/${this.activeProviderName.charAt(0).toUpperCase() + this.activeProviderName.slice(1)}Provider.js`;
      const { default: Provider } = await import(providerPath);
      
      this.provider = new Provider(this.bot);
      await this.provider.init();
      
      this.bot.logger.info('Database connection established.');
    } catch (error) {
      this.bot.logger.error(`DATABASE CRITICAL ERROR: ${error.message}`);
      throw error;
    }
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
