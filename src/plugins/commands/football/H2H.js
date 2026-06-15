/**
 * @fileOverview Head-to-Head match statistics.
 */
import axios from 'axios';

export default {
  name: "h2h",
  aliases: ["headtohead"],
  category: "football",
  description: "Compare two teams' historical performance.",
  usage: "h2h <team1> vs <team2>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_h2h?query=${encodeURIComponent(query)}`);
      const d = res.data.data;

      const output = `┌──⌈ ⚔️ HEAD-TO-HEAD ⌋
┃ Match: ${query}
┃
├─ ${d.team1}: ${d.wins1} Wins
├─ ${d.team2}: ${d.wins2} Wins
├─ Draws: ${d.draws}
┃
┃ Last Result: ${d.lastScore}
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ H2H data not found.\n└────────────────");
    }
  }
};
