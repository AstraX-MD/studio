/**
 * @fileOverview Search for anime details.
 */
import axios from 'axios';

export default {
  name: "anime",
  aliases: ["anisearch"],
  category: "tools",
  description: "Get detailed information about an anime.",
  usage: "anime <title>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const query = args.join(' ');
    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}anime <name>\n└────────────────`);

    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
      const data = res.data.data[0];

      if (!data) throw new Error('Not found');

      const output = `┌──⌈ ⛩️ ANIME INFO ⌋
┃ Title: ${data.title}
┃ Type: ${data.type}
┃ Status: ${data.status}
┃ Episodes: ${data.episodes || 'N/A'}
┃ Score: ${data.score}
┃ Season: ${data.season || 'N/A'} ${data.year || ''}
┃
┃ Synopsis: ${data.synopsis?.substring(0, 200)}...
└────────────────`;
      
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: data.images.jpg.image_url },
        caption: output
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Anime not found.\n└────────────────`);
    }
  }
};