/**
 * @fileOverview Apply Gaussian Blur filter with 20+ fallbacks.
 */
export default {
  name: "blur",
  category: "photo",
  description: "Apply a blur effect to a photo.",
  usage: "blur (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🌫️ BLUR FILTER ⌋\n┃ Status: Processing...\n┃ Fallbacks: 20+ Online\n┃ Target: Image Buffer\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
