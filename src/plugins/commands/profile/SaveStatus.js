/**
 * @fileOverview Download media from a status update.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "savestatus",
  aliases: ["getstatusmedia", "ssave"],
  category: "profile",
  description: "Download photos or videos from a status by replying to them.",
  usage: "savestatus (reply to status)",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Please reply to a status update.\n└────────────────");
    }

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      const type = quoted.imageMessage ? 'image' : 'video';

      await ctx.sock.sendMessage(ctx.jid, { 
        [type]: buffer,
        caption: `┌──⌈ 📥 STATUS SAVED ⌋\n┃ Type: ${type.toUpperCase()}\n┃ Status: Extracted\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to extract status media.\n└────────────────");
    }
  }
};
