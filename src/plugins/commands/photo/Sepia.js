/**
 * @fileOverview Vintage Sepia filter.
 */
export default {
  name: "sepia",
  category: "photo",
  description: "Apply a vintage sepia tone to an image.",
  usage: "sepia (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🎞️ SEPIA ⌋\n┃ Status: Retro-Grading...\n┃ Mode: Vintage\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
