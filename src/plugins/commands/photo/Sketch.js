/**
 * @fileOverview Pencil sketch filter.
 */
export default {
  name: "sketch",
  category: "photo",
  description: "Convert an image into a pencil sketch.",
  usage: "sketch (reply to image)",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ ✏️ SKETCH ⌋\n┃ Status: Drawing...\n┃ Mode: Graphite\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
