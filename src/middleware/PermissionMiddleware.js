
/**
 * @fileOverview Command interceptor for permission validation.
 */
import { ROLE_NAMES } from '../configs/permissions.js';

export default class PermissionMiddleware {
  /**
   * Validates if the user can execute the command.
   * @returns {Promise<boolean>} - True if allowed.
   */
  static async validate(bot, command, ctx) {
    // 1. Resolve user role
    const userRole = await bot.managers.roles.getRole(ctx.sender, ctx.isGroup ? ctx.jid : null);

    // 2. Check Blacklist
    if (userRole === 0) {
      // Silent ignore for blacklisted users to prevent spam
      return false;
    }

    // 3. Command specific flags
    if (command.ownerOnly && userRole < 9) {
      await ctx.reply('🚫 This command is reserved for the *Bot Owner*.');
      return false;
    }

    if (command.rootOnly && userRole < 10) {
      await ctx.reply('🚫 This command is reserved for the *Root Administrator*.');
      return false;
    }

    if (command.groupOnly && !ctx.isGroup) {
      await ctx.reply('🚫 This command can only be used in *Groups*.');
      return false;
    }

    if (command.privateOnly && ctx.isGroup) {
      await ctx.reply('🚫 This command can only be used in *Private Chat*.');
      return false;
    }

    // 4. Hierarchical Role Check
    const requiredRole = command.permissions || 1; // Default to USER (1)
    if (userRole < requiredRole) {
      const requiredName = ROLE_NAMES[requiredRole];
      await ctx.reply(`🚫 *Access Denied*\n\nRequired Rank: ${requiredName}\nUse !help for available commands.`);
      return false;
    }

    return true;
  }
}
