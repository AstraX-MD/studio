/**
 * @fileOverview Get random Shinobu images.
 */
import axios from 'axios';

export default {
  name: "shinobu",
  category: "anime",
  description: "Get random images of Shinobu Oshino.",
  usage: "shinobu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    try {
      const res = await axios.get('https://api.waifu.pics/sfw/shinobu');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: res.data.url },
        caption: `┌──⌈ 🦋 SHINOBU ⌋\n┃ Status: Collected\n└─ 🌌 ${botName}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Image not found.\n└────────────────");
    }
  }
};