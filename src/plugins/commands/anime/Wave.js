/**
 * @fileOverview Anime wave reaction.
 */
import axios from 'axios';

export default {
  name: "wave",
  category: "anime",
  description: "Wave with an anime GIF.",
  usage: "wave",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const sources = ['https://api.waifu.pics/sfw/wave', 'https://nekos.best/api/v2/wave'];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const gif = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          video: { url: gif },
          gifPlayback: true,
          caption: `┌──⌈ 👋 WAVE ⌋\n┃ @${ctx.sender.split('@')[0]} waves hello!\n└─ 🌌 ${botName}`,
          mentions: [ctx.sender]
        }, { quoted: ctx.msg });
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Wave source unavailable.\n└────────────────");
  }
};