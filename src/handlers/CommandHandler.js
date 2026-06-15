
/**
 * @fileOverview Executes command logic and handles permissions/errors.
 */
class CommandHandler {
  constructor(bot) {
    this.bot = bot;
  }

  async execute(command, ctx, args) {
    try {
      // Future: Permission checks will go here
      await command.execute(ctx, args);
    } catch (error) {
      this.bot.logger.error(`Command Error [${command.name}]: ${error.message}`);
      await ctx.reply(`⚠️ *Error:* ${error.message}`);
    }
  }
}

export default CommandHandler;
