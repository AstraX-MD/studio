/**
 * @fileOverview Convert GIF to MP4 video.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "tomp4",
  category: "converter",
  description: "Convert an animated GIF or sticker into an MP4 video.",
  usage: "tomp4 (reply to animated media)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      await ctx.sock.sendMessage(ctx.jid, { 
        video: buffer,
        caption: `┌──⌈ 🎥 MP4 ⌋\n┃ Status: Re-encoded\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Conversion failed.\n└────────────────");
    }
  }
};
