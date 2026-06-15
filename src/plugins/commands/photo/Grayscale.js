/**
 * @fileOverview Black and White filter.
 */
export default {
  name: "grayscale",
  aliases: ["bw"],
  category: "photo",
  description: "Convert an image to black and white.",
  usage: "grayscale (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🏁 GRAYSCALE ⌋\n┃ Status: Desaturating...\n┃ Mode: Monochromatic\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
