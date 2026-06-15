/**
 * @fileOverview Trash can meme.
 */
export default {
  name: "trash",
  category: "photo",
  description: "Put someone's photo in a trash can meme.",
  usage: "trash (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 🗑️ RECYCLE ⌋\n┃ Status: Discarded\n┃ Style: Meme-Box\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
