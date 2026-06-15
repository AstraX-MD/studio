/**
 * @fileOverview Snapchat Spotlight Downloader.
 */
import axios from 'axios';

export default {
  name: "snapchat",
  aliases: ["snap", "snapdl"],
  category: "downloaders",
  description: "Download Snapchat spotlight videos.",
  usage: "snap <url>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let url = args[0];

    if (!url) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Snapchat URL required.\n└────────────────");

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/snapchat?url=${encodeURIComponent(url)}`);
      const video = res.data.data.url;

      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: video },
        caption: `┌──⌈ 📥 SNAPCHAT ⌋\n┃ Status: Downloaded\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch snap.\n└────────────────");
    }
  }
};
