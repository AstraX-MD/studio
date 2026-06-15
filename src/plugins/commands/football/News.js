/**
 * @fileOverview Latest football news.
 */
import axios from 'axios';

export default {
  name: "fnews",
  aliases: ["footballnews"],
  category: "football",
  description: "Get the latest global football headlines.",
  usage: "fnews",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://api.agatz.xyz/api/football_news');
      const news = res.data.data;

      let output = `┌──⌈ 📰 FOOTBALL NEWS ⌋\n┃\n`;
      news.slice(0, 5).forEach((n, i) => {
        output += `├─ ${i + 1}. ${n.title}\n┃    📝 ${n.snippet?.substring(0, 80)}...\n┃\n`;
      });
      output += `└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ News desk currently offline.\n└────────────────");
    }
  }
};
