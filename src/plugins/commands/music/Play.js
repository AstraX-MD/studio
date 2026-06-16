/**
 * @fileOverview Universal Music Scraper Swarm (20+ Fallbacks).
 */
import axios from 'axios';

export default {
  name: "play",
  aliases: ["song", "ytmp3", "music"],
  category: "music",
  description: "Search and download any song with a 20-API redundant swarm.",
  usage: "play <song name>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const query = args.join(' ');
    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Provide a song name.\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 🔍 SEARCHING ⌋\n┃ Query: ${query}\n┃ Status: Querying Swarm...\n└────────────────`);

    // 20+ API Fallback Swarm
    const fallbacks = [
      `https://api.vytmp3.com/search?q=${encodeURIComponent(query)}`,
      `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.dlow.xyz/api/ytmp3?q=${encodeURIComponent(query)}`,
      `https://api.zahwazein.xyz/api/download/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.miftah.xyz/api/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.xyter.com/ytmp3?q=${encodeURIComponent(query)}`,
      `https://api.paxsenix.biz.id/api/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.caliph.biz.id/api/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.yanzbotz.my.id/api/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.erdwpe.my.id/api/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(query)}`,
      `https://api.lolhuman.xyz/api/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.botcahx.live/api/dowloader/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.guruapi.tech/api/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.itzpire.site/ytmp3?url=${encodeURIComponent(query)}`,
      `https://api.skidid.tech/ytmp3?q=${encodeURIComponent(query)}`,
      `https://api.shazam.com/v1/search?query=${encodeURIComponent(query)}`,
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}`,
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song`,
      `https://api.vytmp3.com/ytmp3?url=${encodeURIComponent(query)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url, { timeout: 8000 });
        const data = res.data.data || res.data.result || res.data;
        const audioUrl = data.url || data.link || data.download || (data.results && data.results[0]?.url);

        if (audioUrl) {
          await ctx.sock.sendMessage(ctx.jid, { text: `┌──⌈ ✅ FOUND ⌋\n┃ Title: ${data.title || query}\n┃ Status: Delivering...\n└────────────────`, edit: key });
          
          await ctx.sock.sendMessage(ctx.jid, { 
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            ptt: false
          }, { quoted: ctx.m });
          
          return;
        }
      } catch (e) {
        continue;
      }
    }

    ctx.reply(`┌──⌈ ❌ FAILED ⌋\n┃ All 20 music routes are busy.\n┃ Try again in a moment.\n└────────────────`);
  }
};
