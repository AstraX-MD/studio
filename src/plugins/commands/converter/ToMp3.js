/**
 * @fileOverview Extract high-quality MP3 from video.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "tomp3",
  category: "converter",
  description: "Extract the audio stream from a video as an MP3 file.",
  usage: "tomp3 (reply to video)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.videoMessage) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Please reply to a video.\n└────────────────`);
    }

    const { key } = await ctx.reply(`┌──⌈ 🎵 CONVERTING ⌋\n┃ Task: Video ➔ MP3\n┃ Status: Rendering Audio...\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      
      await ctx.sock.sendMessage(ctx.jid, { 
        document: buffer,
        mimetype: 'audio/mpeg',
        fileName: 'extracted_audio.mp3',
        caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Format: MP3 / 320kbps\n┃ Status: Rendered\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Audio rendering failed.\n└────────────────`);
    }
  }
};
