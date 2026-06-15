
/**
 * @fileOverview Hierarchical role resolver. 
 * Determines user rank based on configuration, database, and group status.
 */
import { ROLES, DEFAULT_ROLE } from '../configs/permissions.js';

export default class RoleManager {
  constructor(bot) {
    this.bot = bot;
    this.groupCache = new Map(); // Simple cache for group metadata to speed up admin checks
  }

  /**
   * Resolves the role of a user.
   * @param {string} jid - User JID.
   * @param {string|null} groupJid - Group JID if the command is in a group.
   * @returns {Promise<number>} - The integer role level.
   */
  async getRole(jid, groupJid = null) {
    const userId = jid.split('@')[0];

    // 1. ROOT OWNER Check (Absolute Priority)
    if (this.bot.config.owners.includes(userId)) {
      return ROLES.ROOT_OWNER;
    }

    // 2. DATABASE Check (Sudo, Premium, VIP, Blacklisted)
    const dbUser = await this.bot.db.get('users', userId);
    if (dbUser && dbUser.role !== undefined) {
      // If user is blacklisted, return immediately
      if (dbUser.role === ROLES.BLACKLISTED) return ROLES.BLACKLISTED;
      
      // If DB role is higher than user, use it (e.g., Sudo/Premium)
      if (dbUser.role > ROLES.USER) return dbUser.role;
    }

    // 3. GROUP ROLE Check (Admin/Moderator)
    if (groupJid) {
      try {
        const metadata = await this.bot.client.sock.groupMetadata(groupJid);
        const participant = metadata.participants.find(p => p.id === jid);
        
        if (participant) {
          if (participant.admin === 'superadmin') return ROLES.OWNER; // Group Creator
          if (participant.admin === 'admin') return ROLES.ADMIN;
        }
      } catch (e) {
        // Fallback if metadata fails
      }
    }

    return DEFAULT_ROLE;
  }

  /**
   * Helper to check if a user is Blacklisted
   */
  async isBlacklisted(jid) {
    const role = await this.getRole(jid);
    return role === ROLES.BLACKLISTED;
  }
}
