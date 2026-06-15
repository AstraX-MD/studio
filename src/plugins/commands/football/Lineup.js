/**
 * @fileOverview (Mock) Match lineups.
 */
export default {
  name: "lineup",
  category: "football",
  description: "Fetch probable or official lineups for a match.",
  usage: "lineup <team1 vs team2>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');
    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Provide match names.\n└────────────────");

    const output = `┌──⌈ 📋 MATCH LINEUP ⌋
┃ Target: ${query}
┃ Status: SEARCHING...
┃ 
┃ Full lineup extraction is 
┃ optimized for Live Matches.
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
