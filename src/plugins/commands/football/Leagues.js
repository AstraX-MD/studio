/**
 * @fileOverview List available football leagues.
 */
export default {
  name: "leagues",
  category: "football",
  description: "List major football leagues covered by the bot.",
  usage: "leagues",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 🏟️ MAJOR LEAGUES ⌋
┃
├─ 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
├─ 🇪🇸 La Liga
├─ 🇮🇹 Serie A
├─ 🇩🇪 Bundesliga
├─ 🇫🇷 Ligue 1
├─ 🇪🇺 Champions League
├─ 🇪🇺 Europa League
├─ 🇺🇸 MLS
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
