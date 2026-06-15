/**
 * @fileOverview Convert animated stickers to videos.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "tovideo",
  aliases: ["tovid", "mp4"],
  category: "converter",
  description: "Convert an animated sticker into a video file.",
  usage: "tovideo (reply to animated sticker)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.stickerMessage?.isAnimated) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Reply to an animated sticker.\n└────────────────`);
    }

    const { key } = await ctx.reply(`┌──⌈ 🎥 CONVERTING ⌋\n┃ Task: Sticker ➔ Video\n┃ Status: Decoding Layers...\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      
      await ctx.sock.sendMessage(ctx.jid, { 
        video: buffer,
        caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Format: Video/MP4\n┃ Status: Decoded\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Conversion failed. All scrapers busy.\n└────────────────`);
    }
  }
};
