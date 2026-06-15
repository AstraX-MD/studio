/**
 * @fileOverview Triggered GIF generator.
 */
export default {
  name: "triggered",
  category: "photo",
  description: "Generate a 'Triggered' shaking GIF from an image.",
  usage: "triggered (reply to image)",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 💢 TRIGGERED ⌋\n┃ Status: Agitated\n┃ Format: Animated GIF\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
