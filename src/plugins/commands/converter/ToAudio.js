/**
 * @fileOverview Extract audio from video or voice notes.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "toaudio",
  aliases: ["tovoice", "ptt"],
  category: "converter",
  description: "Convert a video or audio file into a voice note.",
  usage: "toaudio (reply to media)",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const media = quoted?.audioMessage || quoted?.videoMessage;

    if (!media) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Reply to a video or audio file.\n└────────────────`);
    }

    const { key } = await ctx.reply(`┌──⌈ 🎙️ CONVERTING ⌋\n┃ Task: Media ➔ Voice\n┃ Status: Extracting Stream...\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      
      await ctx.sock.sendMessage(ctx.jid, { 
        audio: buffer,
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { text: `┌──⌈ ✅ SUCCESS ⌋\n┃ Type: Voice Note\n┃ Status: Extracted\n└─ 🌌 ${botName.toUpperCase()}`, edit: key });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Extraction failed.\n└────────────────`);
    }
  }
};
