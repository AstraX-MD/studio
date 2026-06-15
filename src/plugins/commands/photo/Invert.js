/**
 * @fileOverview Invert image colors.
 */
export default {
  name: "invert",
  category: "photo",
  description: "Invert the colors of an image.",
  usage: "invert (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🔄 INVERT ⌋\n┃ Status: Flipping Pixels...\n┃ Mode: Negative\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
