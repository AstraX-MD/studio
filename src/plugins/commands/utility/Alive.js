/**
 * @fileOverview Dynamic status command.
 */
export default {
  name: "alive",
  category: "utility",
  description: "Check if the bot is active.",
  usage: "alive",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const status = `┌──⌈ ${botName.toUpperCase()} STATUS ⌋
┃ Mode: Online
┃ System: Stable
┃ Version: 1.2.5
┃ Status: Active
└────────────────`;
    await ctx.reply(status);
  }
};
