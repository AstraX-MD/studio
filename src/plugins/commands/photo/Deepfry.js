/**
 * @fileOverview Deepfry meme filter.
 */
export default {
  name: "deepfry",
  category: "photo",
  description: "Apply an extreme deepfry filter to an image.",
  usage: "deepfry (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🍟 DEEPFRY ⌋\n┃ Status: Crispy\n┃ Saturation: Max\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
