/**
 * @fileOverview Interface for real-time setting updates from the dashboard.
 */
export default class SettingsDashboard {
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * Gets all global settings.
   */
  async getAllSettings() {
    return await this.bot.db.get('settings', 'global') || {};
  }

  /**
   * Updates a specific setting.
   */
  async updateSetting(category, key, value) {
    await this.bot.managers.settings.set(category, key, value, 'global');
    return true;
  }
}
