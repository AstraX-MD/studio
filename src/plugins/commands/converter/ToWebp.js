/**
 * @fileOverview Convert image to static Webp.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "towebp",
  category: "converter",
  description: "Convert a photo into a static WebP image.",
  usage: "towebp (reply to image)",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      await ctx.sock.sendMessage(ctx.jid, { 
        image: buffer,
        mimetype: 'image/webp',
        caption: `┌──⌈ 🕸️ WEBP ⌋\n┃ Status: Converted\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Conversion failed.\n└────────────────");
    }
  }
};
