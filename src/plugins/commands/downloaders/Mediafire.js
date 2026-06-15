/**
 * @fileOverview Mediafire Direct Downloader.
 */
import axios from 'axios';

export default {
  name: "mediafire",
  aliases: ["mfire", "mf"],
  category: "downloaders",
  description: "Get direct download links for Mediafire files.",
  usage: "mf <url>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const url = args[0];

    if (!url || !url.includes('mediafire.com')) {
      return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Valid Mediafire link required.\n└────────────────");
    }

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/mediafire?url=${encodeURIComponent(url)}`);
      const file = res.data.data;

      await ctx.sock.sendMessage(ctx.jid, { 
        document: { url: file.link },
        mimetype: 'application/octet-stream',
        fileName: file.name,
        caption: `┌──⌈ 📂 MEDIAFIRE ⌋\n┃ Name: ${file.name}\n┃ Size: ${file.size}\n┃ Type: ${file.mime}\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch file metadata.\n└────────────────");
    }
  }
};
