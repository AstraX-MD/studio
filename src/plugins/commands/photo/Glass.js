/**
 * @fileOverview Shattered Glass effect.
 */
export default {
  name: "glass",
  category: "photo",
  description: "Apply a shattered glass effect to an image.",
  usage: "glass (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 💎 SHATTER ⌋\n┃ Status: Breaking...\n┃ Effect: Glass Overlay\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
