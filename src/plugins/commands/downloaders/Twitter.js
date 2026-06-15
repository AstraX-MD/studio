/**
 * @fileOverview Twitter (X) Video Downloader.
 */
import axios from 'axios';

export default {
  name: "twitter",
  aliases: ["tw", "twdl", "x"],
  category: "downloaders",
  description: "Download videos from Twitter/X.",
  usage: "twitter <url>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const url = args[0];

    if (!url) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Twitter/X URL required.\n└────────────────");

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/twitter?url=${encodeURIComponent(url)}`);
      const video = res.data.data[0].url;

      await ctx.sock.sendMessage(ctx.jid, { 
        video: { url: video },
        caption: `┌──⌈ 📥 TWITTER ⌋\n┃ Platform: X.com\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to resolve Twitter link.\n└────────────────");
    }
  }
};
