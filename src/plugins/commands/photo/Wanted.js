/**
 * @fileOverview One Piece Wanted Poster.
 */
export default {
  name: "wantedposter",
  aliases: ["wantedp"],
  category: "photo",
  description: "Create a Wanted poster from an image.",
  usage: "wantedposter (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 📜 WANTED ⌋\n┃ Status: High Bounty\n┃ Style: Pirate Poster\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
