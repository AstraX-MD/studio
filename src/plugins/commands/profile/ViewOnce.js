/**
 * @fileOverview View-Once media recovery tool.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "vv",
  aliases: ["viewonce", "recover"],
  category: "profile",
  description: "Recover and display 'View Once' media by replying to it.",
  usage: "vv (reply to view-once)",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.imageMessage?.viewOnce && !quoted?.videoMessage?.viewOnce) {
      return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Please reply to a View-Once message.\n└────────────────");
    }

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      const type = quoted.imageMessage ? 'image' : 'video';

      const output = `┌──⌈ 👁️ RECOVERED ⌋
┃
┃ Origin: View-Once
┃ Type: ${type.toUpperCase()}
┃ Status: Extraction Success
┃
└────────────────
  © ${botName.toUpperCase()}`;

      await ctx.sock.sendMessage(ctx.jid, { 
        [type]: buffer, 
        caption: output 
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Extraction failed. Media might be expired.\n└────────────────");
    }
  }
};
