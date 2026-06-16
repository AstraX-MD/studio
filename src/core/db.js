import DatabaseManager from '../database/DatabaseManager.js';

class DbBridge {
  constructor() {
    this.manager = new DatabaseManager();
    this.mode = 'ram';
  }

  async init() {
    await this.manager.init();
    this.mode = this.manager.activeProviderName;
  }

  async get(key, field) {
    if (field) {
        const data = await this.manager.get('settings', key) || {};
        return data[field];
    }
    // Handle both collection/key and direct key mapping
    const parts = key.split(':');
    if (parts.length > 1) return this.manager.get(parts[0], parts[1]);
    return this.manager.get('settings', key);
  }

  async set(key, value) {
    const parts = key.split(':');
    if (parts.length > 1) return this.manager.set(parts[0], parts[1], value);
    return this.manager.set('settings', key, value);
  }

  async getGroupKey(groupJid, key) {
    const data = await this.manager.get('settings', groupJid) || {};
    return data[key];
  }
}

export const db = new DbBridge();
export const initDb = () => db.init();