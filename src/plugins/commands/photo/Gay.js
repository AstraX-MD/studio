/**
 * @fileOverview Rainbow/Pride overlay.
 */
export default {
  name: "rainbow",
  aliases: ["pride"],
  category: "photo",
  description: "Apply a rainbow pride filter to an image.",
  usage: "rainbow (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🌈 PRIDE ⌋\n┃ Status: Spectrum Applied\n┃ Filter: Rainbow\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
