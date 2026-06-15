/**
 * @fileOverview Random neko image command.
 */
import axios from 'axios';

export default {
  name: "neko",
  category: "anime",
  description: "Get a random anime cat girl (Neko) image.",
  usage: "neko",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const sources = ['https://api.waifu.pics/sfw/neko', 'https://nekos.best/api/v2/neko'];

    for (const url of sources) {
      try {
        const res = await axios.get(url);
        const img = res.data.url || res.data.results[0].url;

        return await ctx.sock.sendMessage(ctx.jid, { 
          image: { url: img },
          caption: `┌──⌈ 🐈 NEKO ⌋\n┃ Status: Meow!\n└─ 🌌 ${botName}`
        }, { quoted: ctx.msg });
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Content unavailable.\n└────────────────");
  }
};