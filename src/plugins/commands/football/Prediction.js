/**
 * @fileOverview Single match prediction.
 */
import axios from 'axios';

export default {
  name: "predict",
  category: "football",
  description: "Get an AI prediction for a specific match.",
  usage: "predict <match_name>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/football_prediction?match=${encodeURIComponent(query)}`);
      const p = res.data.data;

      const output = `┌──⌈ 🔮 AI PREDICTION ⌋
┃ Match: ${query}
┃
├─ Outcome: ${p.winner}
├─ Score: ${p.correct_score}
├─ Both Teams Score: ${p.btts ? 'YES' : 'NO'}
┃
├─⊷ Confidence: ${p.confidence}%
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Match analysis failed.\n└────────────────");
    }
  }
};
