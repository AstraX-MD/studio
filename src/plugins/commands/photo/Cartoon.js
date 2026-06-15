/**
 * @fileOverview Cartoon/Anime filter.
 */
export default {
  name: "cartoon",
  aliases: ["animefilter"],
  category: "photo",
  description: "Convert an image into a cartoon or anime style.",
  usage: "cartoon (reply to image)",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🎨 CARTOON ⌋\n┃ Status: Stylizing...\n┃ Mode: Animation-Cell\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
