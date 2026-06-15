/**
 * @fileOverview YouTube Video Search.
 */
import axios from 'axios';

export default {
  name: "youtube",
  aliases: ["ytsearch", "yts"],
  category: "tools",
  description: "Search for videos on YouTube.",
  usage: "youtube <query>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const query = args.join(' ');
    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}youtube starboy\n└────────────────`);

    try {
      // Using a free scraping proxy or API
      const res = await axios.get(`https://api.shazam.com/v1/search?query=${encodeURIComponent(query)}&limit=3`);
      const items = res.data.tracks?.hits || [];

      let output = `┌──⌈ 🎥 YOUTUBE SEARCH ⌋\n┃ Query: ${query}\n┃\n`;
      items.forEach((it, i) => {
        output += `├─ ${i + 1}. ${it.track.title}\n┃ 🔗 https://youtube.com/watch?v=${it.track.key}\n┃\n`;
      });
      output += `└─ 🌌 AstraX Enterprise`;

      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ YouTube search failed.\n└────────────────`);
    }
  }
};