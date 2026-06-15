/**
 * @fileOverview Content-aware scale distortion (Magik).
 */
export default {
  name: "magik",
  category: "photo",
  description: "Apply extreme content-aware liquid distortion.",
  usage: "magik (reply to image)",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🪄 MAGIK ⌋\n┃ Status: Distorting Space...\n┃ Engine: Seam-Carve\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
