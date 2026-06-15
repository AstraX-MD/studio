/**
 * @fileOverview Central bridge between AstraX Bot Core and the Next.js Dashboard.
 */
import AuthManager from '../dashboard/auth.js';
import SessionDashboard from '../dashboard/sessions.js';
import SettingsDashboard from '../dashboard/settings.js';
import StatsDashboard from '../dashboard/statistics.js';
import PluginDashboard from '../dashboard/plugins.js';
import PermissionDashboard from '../dashboard/permissions.js';

export default class DashboardManager {
  constructor(bot) {
    this.bot = bot;
    this.auth = new AuthManager(bot);
    this.sessions = new SessionDashboard(bot);
    this.settings = new SettingsDashboard(bot);
    this.stats = new StatsDashboard(bot);
    this.plugins = new PluginDashboard(bot);
    this.permissions = new PermissionDashboard(bot);
    
    this.isEnabled = bot.config.dashboard?.enabled || false;
  }

  /**
   * Initializes the dashboard bridge.
   */
  async init() {
    if (!this.isEnabled) return;
    console.log('==> DASHBOARD: Web-Bridge architecture operational.');
  }

  /**
   * Gets a complete system snapshot for the dashboard overview.
   */
  async getSystemSnapshot() {
    return {
      stats: await this.stats.getGlobalStats(),
      sessions: await this.sessions.getActiveSessions(),
      health: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        database: this.bot.db.activeProviderName
      }
    };
  }
}
