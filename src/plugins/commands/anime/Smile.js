/**
 * @fileOverview Anime smile reaction.
 */
import axios from 'axios';

export default {
  name: "smile",
  category: "anime",
  description: "Show a smiling anime GIF.",
  usage: "smile",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const sources = ['https://api.waifu.pics/sfw/smile', 'https://nekos.best/api/v2/smile'];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const gif = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          video: { url: gif },
          gifPlayback: true,
          caption: `┌──⌈ 😊 SMILE ⌋\n┃ @${ctx.sender.split('@')[0]} is smiling!\n└─ 🌌 ${botName}`,
          mentions: [ctx.sender]
        }, { quoted: ctx.msg });
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Smile source failed.\n└────────────────");
  }
};