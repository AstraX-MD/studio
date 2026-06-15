/**
 * @fileOverview Restart the bot process.
 */
export default {
  name: "restart",
  aliases: ["reboot", "refresh"],
  category: "owner",
  description: "Triggers a system-wide reboot of the bot engine.",
  usage: "restart",
  ownerOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 🔄 RESTART ⌋
┃
┃ Target: Global Node
┃ Status: Rebooting...
┃ Mode: Hot-Reload
┃
┃ System will be back 
┃ online in ~10 seconds.
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.reply(output);
    
    // Allow time for message to send
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  }
};
