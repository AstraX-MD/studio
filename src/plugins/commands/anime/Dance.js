/**
 * @fileOverview Anime dance reaction.
 */
import axios from 'axios';

export default {
  name: "dance",
  category: "anime",
  description: "Dance with an anime GIF.",
  usage: "dance",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const sources = ['https://api.waifu.pics/sfw/dance', 'https://nekos.best/api/v2/dance'];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const gif = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          video: { url: gif },
          gifPlayback: true,
          caption: `┌──⌈ 💃 DANCE ⌋\n┃ @${ctx.sender.split('@')[0]} starts dancing!\n└─ 🌌 ${botName}`,
          mentions: [ctx.sender]
        }, { quoted: ctx.msg });
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Dance source unavailable.\n└────────────────");
  }
};