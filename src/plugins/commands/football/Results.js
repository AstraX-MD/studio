/**
 * @fileOverview Past match results.
 */
import axios from 'axios';

export default {
  name: "results",
  category: "football",
  description: "View recent football match results.",
  usage: "results <league>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const league = args.join(' ') || 'Premier League';

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_results?league=${encodeURIComponent(league)}`);
      const results = res.data.data;

      let output = `┌──⌈ ✅ RECENT RESULTS ⌋\n┃ League: ${league}\n┃\n`;
      results.slice(0, 10).forEach(r => {
        output += `├─ ${r.homeTeam} [${r.score}] ${r.awayTeam}\n┃    📅 Date: ${r.date}\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Results not found.\n└────────────────");
    }
  }
};
