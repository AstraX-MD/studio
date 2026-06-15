/**
 * @fileOverview Executes command logic and handles permissions/errors.
 * v1.2.5: Fail-Safe Execution Core.
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

      // 3. Cooldown Validation (Silent for UX)
      const remaining = this.cooldownManager.getRemainingCooldown(
        ctx.sender, 
        command.name, 
        (command.cooldown || 2) * 1000
      );

      if (remaining) {
        // Cooldown enforced silently to prevent spam.
        return;
      }

      // 4. Execution Logic with Fail-Safe
      if (typeof command.execute === 'function') {
        await command.execute(ctx, args);
      } else {
        throw new Error('Command logic missing execute() function.');
      }
      
    } catch (error) {
      console.log(`==> ERROR: [${command.name}] execution failed: ${error.message}`);
      if (!ctx.fromMe) {
        await ctx.reply(`⚠️ *Framework Error*\n\nDetails: ${error.message}\n_Reporting to developers..._`);
      }
    }
  }
}

export default CommandHandler;