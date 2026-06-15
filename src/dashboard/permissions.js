/**
 * @fileOverview Bridge for RBAC (Role-Based Access Control) management.
 */
import { ROLE_NAMES } from '../configs/permissions.js';

export default class PermissionDashboard {
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * Gets all available roles.
   */
  async getAvailableRoles() {
    return ROLE_NAMES;
  }

  /**
   * Updates a user's role via dashboard.
   */
  async updateUserRole(jid, roleLevel) {
    const userId = jid.split('@')[0];
    await this.bot.db.set('users', userId, { role: parseInt(roleLevel) });
    return true;
  }
}
