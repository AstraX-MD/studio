/**
 * @fileOverview Soviet overlay.
 */
export default {
  name: "communism",
  aliases: ["soviet"],
  category: "photo",
  description: "Apply a Soviet communism overlay to an image.",
  usage: "communism (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🚩 OUR IMAGE ⌋\n┃ Status: Distributed\n┃ Mode: Comrade\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
