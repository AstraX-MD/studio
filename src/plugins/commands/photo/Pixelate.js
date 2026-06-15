/**
 * @fileOverview Pixel art filter.
 */
export default {
  name: "pixelate",
  category: "photo",
  description: "Convert an image into pixel art.",
  usage: "pixelate (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 👾 PIXELATE ⌋\n┃ Status: Downsampling...\n┃ Mode: 8-Bit Style\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
