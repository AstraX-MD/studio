/**
 * @fileOverview Update the bot's 'About' info.
 */
export default {
  name: "setstatus",
  aliases: ["setbio", "updatestatus"],
  category: "profile",
  description: "Update the bot's current About/Status message.",
  usage: "setstatus <text>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const text = args.join(' ');
    if (!text) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Provide status text.\n└────────────────`);

    try {
      await ctx.sock.updateProfileStatus(text);
      ctx.reply(`┌──⌈ ✅ BIO UPDATED ⌋\n┃ New Bio: ${text}\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to update bio.\n└────────────────");
    }
  }
};
