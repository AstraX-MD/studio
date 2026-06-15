/**
 * @fileOverview Toggle read receipts for the bot.
 */
export default {
  name: "readreceipts",
  aliases: ["blueticks", "readrec"],
  category: "profile",
  description: "Toggle the bot's ability to show blue ticks.",
  usage: "readreceipts <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const mode = args[0]?.toLowerCase();

    const output = `┌──⌈ ✅ READ RECEIPTS ⌋
┃
┃ Status: ${mode === 'off' ? '❌ DISABLED' : '✅ ENABLED'}
┃ Visibility: ${mode === 'off' ? 'GHOST' : 'NORMAL'}
┃
┃ (Settings applied to 
┃ Global Profile)
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
