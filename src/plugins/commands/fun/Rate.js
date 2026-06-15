/**
 * @fileOverview Random rating tool.
 */
export default {
  name: "rate",
  category: "fun",
  description: "Rate something or someone (Fun).",
  usage: "rate <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ') || 'User';
    const rating = Math.floor(Math.random() * 11);

    const output = `┌──⌈ ⭐ RATING ⌋
┃ Target: ${query}
┃ Rating: ${rating}/10
┃ Comment: ${rating > 7 ? 'MASTERPIECE' : rating > 4 ? 'DECENT' : 'TRASH'}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
