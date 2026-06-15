/**
 * @fileOverview Prison Bars Overlay.
 */
export default {
  name: "jail",
  category: "photo",
  description: "Apply a prison bars overlay to an image.",
  usage: "jail (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ ⛓️ JAIL ⌋\n┃ Status: Incarcerated\n┃ Bars: Rendered\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
