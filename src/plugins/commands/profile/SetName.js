/**
 * @fileOverview Update the bot's profile name.
 */
export default {
  name: "setname",
  category: "profile",
  description: "Change the bot's official WhatsApp name.",
  usage: "setname <new name>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const name = args.join(' ');
    if (!name) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Name missing.\n└────────────────`);

    try {
      await ctx.sock.updateProfileName(name);
      ctx.reply(`┌──⌈ ✅ NAME UPDATED ⌋\n┃ Bot Name: ${name}\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};
