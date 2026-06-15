/**
 * @fileOverview Convert stickers to images.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "toimage",
  aliases: ["toimg", "img"],
  category: "converter",
  description: "Convert a sticker into a standard image file.",
  usage: "toimage (reply to sticker)",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.stickerMessage) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Please reply to a sticker.\n└────────────────`);
    }

    const { key } = await ctx.reply(`┌──⌈ 📸 CONVERTING ⌋\n┃ Task: Sticker ➔ Image\n┃ Status: Processing...\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      
      await ctx.sock.sendMessage(ctx.jid, { 
        image: buffer,
        caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Format: Image/PNG\n┃ Status: Rendered\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Conversion failed. Sticker might be corrupted.\n└────────────────`);
    }
  }
};
