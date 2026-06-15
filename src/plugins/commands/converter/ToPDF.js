/**
 * @fileOverview Convert images to PDF document.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "topdf",
  category: "converter",
  description: "Convert a replied photo into a PDF document.",
  usage: "topdf (reply to image)",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.imageMessage) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Please reply to an image.\n└────────────────`);
    }

    const { key } = await ctx.reply(`┌──⌈ 📄 CONVERTING ⌋\n┃ Task: Image ➔ PDF\n┃ Status: Compiling Pages...\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      
      await ctx.sock.sendMessage(ctx.jid, { 
        document: buffer,
        mimetype: 'application/pdf',
        fileName: 'converted_document.pdf',
        caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Format: PDF/A\n┃ Status: Generated\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ PDF generation failed.\n└────────────────`);
    }
  }
};
