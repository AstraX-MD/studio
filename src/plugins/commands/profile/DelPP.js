/**
 * @fileOverview Remove the bot's profile picture.
 */
export default {
  name: "delpp",
  aliases: ["removepp", "clearpp"],
  category: "profile",
  description: "Remove the bot's current profile picture.",
  usage: "delpp",
  permissions: 9,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    try {
      await ctx.sock.removeProfilePicture(ctx.sock.user.id);
      ctx.reply(`┌──⌈ 🗑️ PP REMOVED ⌋\n┃ Bot icon cleared.\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};
