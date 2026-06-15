/**
 * @fileOverview Standardized Database Manager for v1.2.5.
 * FIXED: Removed legacy logger references to prevent boot failures.
 */
export default class DatabaseManager {
  constructor(bot) {
    this.bot = bot;
    this.provider = null;
    this.activeProviderName = process.env.DATABASE_TYPE || 'ram';
  }

  async init() {
    try {
      console.log(`==> DATABASE: Initializing [${this.activeProviderName.toUpperCase()}] Layer...`);
      await this._loadProvider(this.activeProviderName);
    } catch (error) {
      console.log(`==> DATABASE: Primary [${this.activeProviderName}] failed. Falling back...`);
      await this._loadProvider('ram');
    }
  }

  async _loadProvider(name) {
    const providerPath = `./providers/${name.charAt(0).toUpperCase() + name.slice(1)}Provider.js`;
    const { default: Provider } = await import(providerPath);
    
    this.provider = new Provider(this.bot);
    await this.provider.init();
    this.activeProviderName = name;
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
