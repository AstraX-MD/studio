/**
 * @fileOverview High probability betting tips.
 */
import axios from 'axios';

export default {
  name: "surebets",
  aliases: ["tips", "predictions"],
  category: "football",
  description: "Get daily high-probability football betting tips.",
  usage: "surebets",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.agatz.xyz/api/football_predict');
      const tips = res.data.data;

      let output = `┌──⌈ 💎 SURE BETS ⌋\n┃\n`;
      tips.slice(0, 8).forEach(t => {
        output += `├─ ${t.match}\n┃    🎯 Tip: ${t.prediction}\n┃    📈 Confidence: ${t.probability}%\n┃    🏆 ${t.league}\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Prediction archives busy.\n└────────────────");
    }
  }
};
