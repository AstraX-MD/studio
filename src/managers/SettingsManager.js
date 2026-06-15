/**
 * @fileOverview Orchestrates dynamic bot settings stored in the database.
 * Supports global defaults and group-specific overrides.
 */
export default class SettingsManager {
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * Retrieves a setting value with a hierarchical fallback.
   * Priority: Group DB -> Global DB -> File Config
   * @param {string} category - e.g., 'security', 'automation', 'core'
   * @param {string} key - e.g., 'antiLink', 'prefix'
   * @param {string|null} jid - Group JID for group-specific overrides.
   * @returns {Promise<any>}
   */
  async get(category, key, jid = null) {
    // 1. Try Group-specific database override
    if (jid && jid.endsWith('@g.us')) {
      const groupData = await this.bot.db.get('settings', jid);
      if (groupData && groupData[category] && groupData[category][key] !== undefined) {
        return groupData[category][key];
      }
    }

    // 2. Try Global database override
    const globalData = await this.bot.db.get('settings', 'global');
    if (globalData && globalData[category] && globalData[category][key] !== undefined) {
      return globalData[category][key];
    }

    // 3. Fallback to static config files
    try {
      // Mapping categories to their config filenames
      const configMap = {
        core: 'default',
        security: 'features',
        automation: 'features'
      };
      
      const fileName = configMap[category] || category;
      const { default: staticConfig } = await import(`../configs/${fileName}.js`);
      
      // Handle nested structures (e.g., security.antiLink.enabled)
      if (category === 'security' || category === 'automation') {
        return staticConfig[category]?.[key] ?? staticConfig[key];
      }
      
      return staticConfig[key];
    } catch (e) {
      return null;
    }
  }

  /**
   * Updates a setting in the database.
   * @param {string} category
   * @param {string} key
   * @param {any} value
   * @param {string} jid - 'global' or a specific group JID.
   */
  async set(category, key, value, jid = 'global') {
    const currentData = (await this.bot.db.get('settings', jid)) || {};
    if (!currentData[category]) currentData[category] = {};
    
    currentData[category][key] = value;
    await this.bot.db.set('settings', jid, currentData);
    
    console.log(`==> SETTINGS: [${jid}] ${category}.${key} = ${value}`);
  }

  /**
   * Check if the bot is in maintenance mode.
   */
  async isMaintenance() {
    return await this.get('core', 'maintenance', 'global');
  }
}
