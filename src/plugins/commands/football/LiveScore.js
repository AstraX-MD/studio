/**
 * @fileOverview Real-time live scores.
 */
import axios from 'axios';

export default {
  name: "livescore",
  aliases: ["live", "score"],
  category: "football",
  description: "View live scores of ongoing football matches.",
  usage: "livescore",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.agatz.xyz/api/football_live');
      const scores = res.data.data;

      if (!scores || scores.length === 0) {
        return ctx.reply(`┌──⌈ 🔴 LIVESCORE ⌋\n┃ No matches currently live.\n└─ 🌌 ${botName.toUpperCase()}`);
      }

      let output = `┌──⌈ 🔴 LIVE SCORES ⌋\n┃\n`;
      scores.slice(0, 10).forEach(s => {
        output += `├─ ${s.homeTeam} [${s.score}] ${s.awayTeam}\n┃    ⏱️ Minute: ${s.time}'\n┃    🏆 ${s.league}\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Score engine currently busy.\n└────────────────");
    }
  }
};
