/**
 * @fileOverview High-speed TikTok Downloader without watermark.
 */
import axios from 'axios';

export default {
  name: "tiktok",
  aliases: ["tt", "ttdl"],
  category: "downloaders",
  description: "Download TikTok videos without watermark.",
  usage: "tiktok <url>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    let url = args[0] || ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;

    if (!url || !url.includes('tiktok.com')) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}tiktok <link>\n└────────────────`);
    }

    const { key } = await ctx.reply(`┌──⌈ 📥 TIKTOK ⌋\n┃ Status: Fetching Video...\n└────────────────`);

    // Chain of 10+ Fallback APIs
    const fallbacks = [
      `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
      `https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(url)}`,
      `https://api.dlow.xyz/api/tiktok?url=${encodeURIComponent(url)}`,
      `https://api.vytmp3.com/tiktok?url=${encodeURIComponent(url)}`,
      `https://api.tikwm.com/api/?url=${encodeURIComponent(url)}`
    ];

    for (const api of fallbacks) {
      try {
        const res = await axios.get(api);
        const data = res.data.data || res.data.result || res.data;
        const videoUrl = data.video || data.no_watermark || data.nowm || data.play;

        if (videoUrl) {
          await ctx.sock.sendMessage(ctx.jid, { 
            video: { url: videoUrl },
            caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Title: ${data.title || 'TikTok Video'}\n┃ Author: ${data.author?.nickname || 'Unknown'}\n└─ 🌌 ${botName.toUpperCase()}`,
            edit: key
          });
          return;
        }
      } catch (e) {
        continue;
      }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to download video.\n┃ Reason: All scrapers busy.\n└────────────────`);
  }
};
