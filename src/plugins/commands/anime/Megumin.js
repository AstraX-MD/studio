/**
 * @fileOverview Get random Megumin images.
 */
import axios from 'axios';

export default {
  name: "megumin",
  category: "anime",
  description: "Get random images of Megumin (Explosion!).",
  usage: "megumin",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    try {
      const res = await axios.get('https://api.waifu.pics/sfw/megumin');
      await ctx.sock.sendMessage(ctx.jid, { 
        image: { url: res.data.url },
        caption: `┌──⌈ 💥 MEGUMIN ⌋\n┃ Explosion Level: Max\n└─ 🌌 ${botName}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Could not load explosion.\n└────────────────");
    }
  }
};