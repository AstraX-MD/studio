/**
 * @fileOverview Executes command logic and handles analytics.
 * v1.2.5: Removed intrusive cooldown messages. SILENT MODE.
 */
import PermissionMiddleware from '../middleware/PermissionMiddleware.js';
import CooldownManager from '../managers/CooldownManager.js';

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.cooldownManager = new CooldownManager();
  }

  async execute(command, ctx, args) {
    try {
      // 1. Permission Validation
      const isAllowed = await PermissionMiddleware.validate(this.bot, command, ctx);
      if (!isAllowed) return;

      // 2. Cooldown Validation (Silent for UX)
      const remaining = this.cooldownManager.getRemainingCooldown(
        ctx.sender, 
        command.name, 
        (command.cooldown || 1) * 1000
      );

      // SILENT COOLDOWN: No reply sent
      if (remaining) return;

      // 3. Track Usage for Dashboard
      const currentUsage = await this.bot.db.get('command_usage', command.name) || 0;
      await this.bot.db.set('command_usage', command.name, currentUsage + 1);

      // 4. Execution
      if (typeof command.execute === 'function') {
        await command.execute(ctx, args);
      } else {
        throw new Error('Command logic missing execute().');
      }
      
    } catch (error) {
      console.log(`\x1b[31m==> ERROR: [${command.name}] failed: ${error.message}\x1b[0m`);
      
      const failedCount = await this.bot.db.get('stats', 'failed_count') || 0;
      await this.bot.db.set('stats', 'failed_count', failedCount + 1);

      // Simple Error Reply
      await ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ \n┃ Command failed.\n┃ Reason: ${error.message}\n└────────────────`);
    }
  }
}

export default CommandHandler;
