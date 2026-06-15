/**
 * @fileOverview Overwritten by owner category for security.
 */
export default {
  name: "shutdown_deprecated",
  category: "sudo",
  description: "Command moved to Owner category.",
  permissions: 10,
  execute: async (ctx) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix') || '!';
    ctx.reply(`🚫 This command has been upgraded. Use ${prefix}shutdown under Owner category.`);
  }
};
