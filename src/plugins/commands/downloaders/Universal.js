/**
 * @fileOverview Expert level Universal Media Downloader.
 */
import axios from 'axios';

export default {
  name: "dl",
  aliases: ["universal", "getmedia"],
  category: "downloaders",
  description: "One command to download from TikTok, FB, IG, YT, Twitter, and 50+ sites.",
  usage: "dl <url>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const url = args[0];
    if (!url) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Link required.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 📥 UNIVERSAL DL ⌋\n┃ Status: Fetching...\n┃ Platform: Auto-Detect\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(url)}`,
      `https://api.vytmp3.com/all?url=${encodeURIComponent(url)}`,
      `https://api.dlow.xyz/api/download?q=${encodeURIComponent(url)}`
    ];

    for (const api of fallbacks) {
      try {
        const res = await axios.get(api);
        const data = res.data.data || res.data.result;
        const media = data.video || data.url || data.link;

        if (media) {
          await ctx.sock.sendMessage(ctx.jid, { 
            video: { url: media }, 
            caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Result: Extracted\n└────────────────`
          }, { quoted: ctx.msg });
          return await ctx.sock.sendMessage(ctx.jid, { delete: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ All scrapers busy.\n└────────────────");
  }
};
