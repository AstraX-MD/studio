/**
 * @fileOverview GTA Wasted Overlay.
 */
export default {
  name: "wasted",
  category: "photo",
  description: "Apply the GTA 'Wasted' overlay to an image.",
  usage: "wasted (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 💀 WASTED ⌋\n┃ Status: Mission Failed\n┃ Overlay: Applied\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
