/**
 * @fileOverview Facebook Video Downloader.
 */
import axios from 'axios';

export default {
  name: "facebook",
  aliases: ["fb", "fbdl"],
  category: "downloaders",
  description: "Download high-quality Facebook videos.",
  usage: "fb <url>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let url = args[0] || ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;

    if (!url) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Facebook URL required.\n└────────────────");

    await ctx.reply(`┌──⌈ 📥 FACEBOOK ⌋\n┃ Status: Buffering Video...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/facebook?url=${encodeURIComponent(url)}`,
      `https://api.dlow.xyz/api/facebook?url=${encodeURIComponent(url)}`,
      `https://api.vytmp3.com/facebook?url=${encodeURIComponent(url)}`
    ];

    for (const api of fallbacks) {
      try {
        const res = await axios.get(api);
        const data = res.data.data || res.data.result;
        const video = data.hd || data.sd || data.url;

        if (video) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            video: { url: video },
            caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Platform: Facebook\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Could not resolve Facebook link.\n└────────────────");
  }
};
