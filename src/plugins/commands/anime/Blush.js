/**
 * @fileOverview Anime blush reaction.
 */
import axios from 'axios';

export default {
  name: "blush",
  category: "anime",
  description: "Show a blushing anime GIF.",
  usage: "blush",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const sources = ['https://api.waifu.pics/sfw/blush', 'https://nekos.best/api/v2/blush'];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const gif = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          video: { url: gif },
          gifPlayback: true,
          caption: `┌──⌈ 😳 BLUSH ⌋\n┃ @${ctx.sender.split('@')[0]} is blushing!\n└─ 🌌 ${botName}`,
          mentions: [ctx.sender]
        }, { quoted: ctx.msg });
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to load reaction.\n└────────────────");
  }
};