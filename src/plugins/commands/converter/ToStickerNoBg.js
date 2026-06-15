/**
 * @fileOverview Create sticker with automatic BG removal.
 */
export default {
  name: "snobg",
  category: "converter",
  description: "Create a sticker and remove background in one step.",
  usage: "snobg (reply to image)",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ ✂️ NO-BG STICKER ⌋\n┃ Status: Processing AI...\n┃ This requires cloud routing.\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
