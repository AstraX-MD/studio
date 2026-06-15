/**
 * @fileOverview League table standings.
 */
import axios from 'axios';

export default {
  name: "standings",
  aliases: ["table", "points"],
  category: "football",
  description: "View the points table for a specific league.",
  usage: "standings <league_name>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ') || 'Premier League';

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_standings?league=${encodeURIComponent(query)}`);
      const table = res.data.data;

      let output = `┌──⌈ 🏆 ${query.toUpperCase()} ⌋\n┃\n`;
      table.slice(0, 10).forEach((t, i) => {
        output += `├─ ${i + 1}. ${t.team}\n┃    P: ${t.played} | W: ${t.win} | D: ${t.draw} | L: ${t.loss} | GD: ${t.gd} | Pts: ${t.points}\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ League table not found.\n└────────────────");
    }
  }
};
