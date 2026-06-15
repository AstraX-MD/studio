/**
 * @fileOverview Executes command logic and handles permissions/errors.
 * Updated with Disable/Enable check.
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
      // 1. Global Disable Check
      const disabledList = await this.bot.db.get('settings', 'disabledCommands') || [];
      if (disabledList.includes(command.name)) {
        return await ctx.reply(`┌──⌈ 🚫 COMMAND DISABLED ⌋\n┃ \n┃ This command is currently\n┃ restricted by the administrator.\n┃ \n└─ 🌌 ${this.bot.config.name.toUpperCase()}`);
      }

      // 2. Permission Validation
      const isAllowed = await PermissionMiddleware.validate(this.bot, command, ctx);
      if (!isAllowed) return;

      // 3. Cooldown Validation
      const remaining = this.cooldownManager.getRemainingCooldown(
        ctx.sender, 
        command.name, 
        (command.cooldown || 3) * 1000
      );

      if (remaining) {
        return await ctx.reply(`⏳ *Wait a moment*\n\nYou are on cooldown. Try again in ${remaining}s.`);
      }

      // 4. Execution
      await command.execute(ctx, args);
      
      this.bot.logger.info(`Command Executed: [${command.name}] by ${ctx.sender}`);
    } catch (error) {
      this.bot.logger.error(`Command Error [${command.name}]: ${error.message}`);
      await ctx.reply(`⚠️ *Framework Error*\n\nDetails: ${error.message}\n_Reporting to developers..._`);
    }
  }
}

export default CommandHandler;
