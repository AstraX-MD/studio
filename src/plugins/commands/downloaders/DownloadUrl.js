/**
 * @fileOverview Universal File Downloader via direct URL.
 */
import axios from 'axios';

export default {
  name: "fetch",
  aliases: ["get", "downloadurl"],
  category: "downloaders",
  description: "Download any file directly from a URL.",
  usage: "fetch <url>",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const url = args[0];

    if (!url || !url.startsWith('http')) {
      return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Direct URL required.\n└────────────────");
    }

    try {
      const head = await axios.head(url);
      const size = parseInt(head.headers['content-length'] || '0');
      
      if (size > 100 * 1024 * 1024) { // 100MB Limit
        return ctx.reply("┌──⌈ ⚠️ LIMIT ⌋\n┃ File is too large (>100MB).\n└────────────────");
      }

      await ctx.sock.sendMessage(ctx.jid, { 
        document: { url: url },
        mimetype: head.headers['content-type'] || 'application/octet-stream',
        fileName: url.split('/').pop() || 'downloaded_file',
        caption: `┌──⌈ 🌐 UNIVERSAL DL ⌋\n┃ Source: Remote Server\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Could not download from URL.\n└────────────────");
    }
  }
};
