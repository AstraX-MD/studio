/**
 * @fileOverview Convert media to document format.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "todoc",
  aliases: ["todocument"],
  category: "converter",
  description: "Send any image/video as a document to preserve quality.",
  usage: "todoc (reply to media)",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const media = quoted?.imageMessage || quoted?.videoMessage;

    if (!media) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Reply to an image or video.\n└────────────────");

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      const type = quoted.imageMessage ? 'image/jpeg' : 'video/mp4';
      const ext = quoted.imageMessage ? 'jpg' : 'mp4';

      await ctx.sock.sendMessage(ctx.jid, { 
        document: buffer,
        mimetype: type,
        fileName: `AstraX_${Date.now()}.${ext}`,
        caption: `┌──⌈ 📂 DOCUMENT ⌋\n┃ Quality: Original\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to package document.\n└────────────────");
    }
  }
};
