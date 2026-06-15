/**
 * @fileOverview Instagram Reels and Post Downloader.
 */
import axios from 'axios';

export default {
  name: "instagram",
  aliases: ["ig", "igdl"],
  category: "downloaders",
  description: "Download Instagram Reels, Photos, and Videos.",
  usage: "ig <url>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    let url = args[0] || ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;

    if (!url || !url.includes('instagram.com')) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}ig <link>\n└────────────────`);
    }

    await ctx.reply(`┌──⌈ 📥 INSTAGRAM ⌋\n┃ Status: Extracting Media...\n└────────────────`);

    const fallbacks = [
      `https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(url)}`,
      `https://api.vytmp3.com/ig?url=${encodeURIComponent(url)}`,
      `https://api.dlow.xyz/api/ig?url=${encodeURIComponent(url)}`
    ];

    for (const api of fallbacks) {
      try {
        const res = await axios.get(api);
        const data = res.data.data || res.data.result;
        const media = data[0] || data;
        const mediaUrl = media.url || media.link || media.download_link;

        if (mediaUrl) {
          return await ctx.sock.sendMessage(ctx.jid, { 
            video: { url: mediaUrl },
            caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Type: Instagram Media\n└─ 🌌 ${botName.toUpperCase()}`
          }, { quoted: ctx.msg });
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Extraction failed. Private account?\n└────────────────");
  }
};
