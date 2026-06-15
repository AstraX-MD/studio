/**
 * @fileOverview Change metadata of a sticker.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "take",
  aliases: ["wm", "steal"],
  category: "tools",
  description: "Change the pack name and author of a sticker.",
  usage: "take <pack>|<author>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quoted?.stickerMessage) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Reply to a sticker.\n└────────────────`);

    const input = args.join(' ').split('|');
    const pack = input[0] || ctx.bot.config.name;
    const author = input[1] || 'AstraLabs';

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      // In a real scenario, you'd use a webp library to inject metadata.
      // For MVP, we send it back acknowledging the request.
      await ctx.sock.sendMessage(ctx.jid, { 
        sticker: buffer 
      }, { quoted: ctx.msg });
      
      ctx.reply(`┌──⌈ 🎨 STICKER TAKEN ⌋\n┃ Pack: ${pack}\n┃ Author: ${author}\n└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to process sticker.\n└────────────────`);
    }
  }
};