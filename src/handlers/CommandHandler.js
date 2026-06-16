/**
 * @fileOverview Executes command logic and tracks analytics.
 */
import PermissionMiddleware from '../middleware/PermissionMiddleware.js';
import CooldownManager from '../managers/CooldownManager.js';
import { logger } from '../core/logger.js';

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.cooldownManager = new CooldownManager();
  }

  async execute(command, ctx, args) {
    const senderId = ctx.sender.split('@')[0];
    
    try {
      // 1. Permission Validation
      const isAllowed = await PermissionMiddleware.validate(this.bot, command, ctx);
      if (!isAllowed) return;

      // 2. Cooldown
      const remaining = this.cooldownManager.getRemainingCooldown(
        ctx.sender, 
        command.name, 
        (command.cooldown || 1) * 1000
      );
      if (remaining) return;

      // 3. Track Usage
      const currentUsage = await this.bot.db.get('command_usage', command.name) || 0;
      await this.bot.db.set('command_usage', command.name, currentUsage + 1);

      // 4. Execution
      if (typeof command.execute === 'function') {
        await command.execute(ctx, args);
        logger.executed(command.name, senderId, true);
      } else {
        throw new Error('Logic missing execute()');
      }
      
    } catch (error) {
      logger.error('CMD', `[${command.name}] failed: ${error.message}`);
      
      const failedCount = await this.bot.db.get('stats', 'failed_count') || 0;
      await this.bot.db.set('stats', 'failed_count', failedCount + 1);
      logger.executed(command.name, senderId, false);

      await ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ \n┃ Command failed.\n┃ Reason: ${error.message}\n└────────────────`);
    }
  }
}

export default CommandHandler;
