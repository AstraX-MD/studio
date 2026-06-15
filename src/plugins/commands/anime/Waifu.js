/**
 * @fileOverview Get random waifu images with fallbacks.
 */
import axios from 'axios';

export default {
  name: "waifu",
  category: "anime",
  description: "Get a random beautiful waifu image.",
  usage: "waifu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    // Fallback URLs
    const sources = [
      'https://api.waifu.pics/sfw/waifu',
      'https://nekos.best/api/v2/waifu'
    ];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const img = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          image: { url: img },
          caption: `┌──⌈ 🌸 WAIFU ⌋\n┃ Status: Found!\n└─ 🌌 ${botName}`
        }, { quoted: ctx.msg });
      } catch (e) {
        continue;
      }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch image. All sources busy.\n└────────────────");
  }
};