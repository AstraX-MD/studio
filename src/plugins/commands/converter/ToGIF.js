/**
 * @fileOverview Convert video to playable GIF.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "togif",
  category: "converter",
  description: "Convert a short video into an animated GIF.",
  usage: "togif (reply to video)",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.videoMessage) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Please reply to a video.\n└────────────────`);
    }

    const { key } = await ctx.reply(`┌──⌈ 🎞️ CONVERTING ⌋\n┃ Task: Video ➔ GIF\n┃ Status: Compressing...\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      
      await ctx.sock.sendMessage(ctx.jid, { 
        video: buffer,
        gifPlayback: true,
        caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Format: GIF\n┃ Status: Compacted\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Compression failed.\n└────────────────`);
    }
  }
};
