/**
 * @fileOverview 'This doesn't affect my child' meme.
 */
export default {
  name: "affect",
  category: "photo",
  description: "Apply the 'Doesn't affect my child' meme template.",
  usage: "affect (reply to image)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 👶 AFFECT ⌋\n┃ Status: Parenting Level 0\n┃ Template: Applied\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
