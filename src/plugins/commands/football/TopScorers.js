/**
 * @fileOverview Top scorers for a league.
 */
import axios from 'axios';

export default {
  name: "topscorers",
  aliases: ["scorers", "goldenboot"],
  category: "football",
  description: "View top goal scorers in a specific league.",
  usage: "topscorers <league>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const league = args.join(' ') || 'Premier League';

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_topscorers?league=${encodeURIComponent(league)}`);
      const data = res.data.data;

      let output = `┌──⌈ ⚽ TOP SCORERS ⌋\n┃ League: ${league}\n┃\n`;
      data.slice(0, 10).forEach((p, i) => {
        output += `├─ ${i + 1}. ${p.name} (${p.team})\n┃    🥅 Goals: ${p.goals} | Assists: ${p.assists}\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Scoring records busy.\n└────────────────");
    }
  }
};
