/**
 * @fileOverview Search for anime details with multiple fallback sources.
 */
import axios from 'axios';

export default {
  name: "anime",
  aliases: ["anisearch", "findanime"],
  category: "anime",
  description: "Search for detailed information about an anime.",
  usage: "anime <query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const query = args.join(' ');

    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}anime <name>\n└────────────────`);

    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
      const data = res.data.data[0];

      if (!data) throw new Error('Not found');

      const output = `┌──⌈ ⛩️ ${data.title.toUpperCase()} ⌋
┃ 
├─ Type: ${data.type}
├─ Score: ${data.score || 'N/A'}
├─ Episodes: ${data.episodes || 'N/A'}
├─ Status: ${data.status}
├─ Duration: ${data.duration}
┃
├─ Synopsis: ${data.synopsis?.substring(0, 300)}...
┃
└─ 🌌 ${botName} Enterprise`;

      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: data.images.jpg.large_image_url },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Anime not found or API busy.\n└────────────────`);
    }
  }
};