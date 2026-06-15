/**
 * @fileOverview Pinterest Image/Video Downloader.
 */
import axios from 'axios';

export default {
  name: "pinterest",
  aliases: ["pin", "pindl"],
  category: "downloaders",
  description: "Download content from Pinterest.",
  usage: "pin <url/query>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ URL or Query required.\n└────────────────");

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/pinterest?url=${encodeURIComponent(query)}`);
      const data = res.data.data;

      if (data.includes('.mp4')) {
        await ctx.sock.sendMessage(ctx.jid, { video: { url: data }, caption: `┌──⌈ 📥 PINTEREST ⌋\n└─ 🌌 ${botName.toUpperCase()}` });
      } else {
        await ctx.sock.sendMessage(ctx.jid, { image: { url: data }, caption: `┌──⌈ 📥 PINTEREST ⌋\n└─ 🌌 ${botName.toUpperCase()}` });
      }
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch Pinterest media.\n└────────────────");
    }
  }
};
