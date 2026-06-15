
/**
 * @fileOverview Executes command logic and handles permissions/errors.
 */
import PermissionMiddleware from '../middleware/PermissionMiddleware.js';

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
  }

  async execute(command, ctx, args) {
    try {
      // Execute Permission Middleware
      const isAllowed = await PermissionMiddleware.validate(this.bot, command, ctx);
      if (!isAllowed) return;

      // Logic execution
      await command.execute(ctx, args);
      
      this.bot.logger.info(`Command Executed: [${command.name}] by ${ctx.sender}`);
    } catch (error) {
      this.bot.logger.error(`Command Error [${command.name}]: ${error.message}`);
      await ctx.reply(`⚠️ *Framework Error*\n\nDetails: ${error.message}\n_Reporting to developers..._`);
    }
  }
}

export default CommandHandler;
