/**
 * @fileOverview Permanently stop the bot process.
 */
export default {
  name: "shutdown",
  aliases: ["stop", "kill"],
  category: "owner",
  description: "Safely terminate the bot engine process.",
  usage: "shutdown",
  ownerOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 🔌 SHUTDOWN ⌋
┃
┃ Target: AstraX Core
┃ Status: Offline
┃ Action: Full Terminate
┃
┃ Manual intervention required
┃ to restart this node.
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.reply(output);
    
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
};
