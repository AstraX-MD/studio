/**
 * @fileOverview Match betting odds.
 */
import axios from 'axios';

export default {
  name: "odds",
  category: "football",
  description: "View real-time betting odds for a match.",
  usage: "odds <match_name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_odds?query=${encodeURIComponent(query)}`);
      const o = res.data.data;

      const output = `┌──⌈ 📈 BETTING ODDS ⌋
┃ Match: ${query}
┃
├─ Home (1): ${o.home || 'N/A'}
├─ Draw (X): ${o.draw || 'N/A'}
├─ Away (2): ${o.away || 'N/A'}
┃
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Odds not available for this match.\n└────────────────");
    }
  }
};
