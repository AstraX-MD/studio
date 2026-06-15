/**
 * @fileOverview FIFA World Rankings.
 */
import axios from 'axios';

export default {
  name: "ranking",
  aliases: ["fifa", "worldrank"],
  category: "football",
  description: "View the current FIFA World Rankings.",
  usage: "ranking",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.agatz.xyz/api/football_ranking');
      const rank = res.data.data;

      let output = `┌──⌈ 🌍 FIFA RANKINGS ⌋\n┃\n`;
      rank.slice(0, 15).forEach((c, i) => {
        output += `├─ ${String(i + 1).padStart(2, '0')}. ${c.country}\n┃    📈 Points: ${c.points}\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ FIFA servers busy.\n└────────────────");
    }
  }
};
