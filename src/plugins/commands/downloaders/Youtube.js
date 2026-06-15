/**
 * @fileOverview Integrated YouTube Downloader (MP3/MP4).
 */
import axios from 'axios';

export default {
  name: "ytv",
  aliases: ["ytmp4", "video"],
  category: "downloaders",
  description: "Download YouTube videos with multi-API fallbacks.",
  usage: "ytv <url/name>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Link or Search query required.\n└────────────────");

    await ctx.reply(`┌──⌈ 📥 YOUTUBE V ⌋\n┃ Query: ${query.substring(0, 20)}\n┃ Status: Optimizing Route...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/ytmp4?url=${encodeURIComponent(query)}`,
      `https://api.dlow.xyz/api/ytmp4?url=${encodeURIComponent(query)}`,
      `https://api.vytmp3.com/ytmp4?url=${encodeURIComponent(query)}`
    ];

    for (const api of fallbacks) {
      try {
        const res = await axios.get(api);
        const data = res.data.data || res.data.result;
        const video = data.url || data.download_link;

        if (video) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            video: { url: video },
            caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Title: ${data.title || 'YouTube Video'}\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Extraction failed. Video too long?\n└────────────────");
  }
};
