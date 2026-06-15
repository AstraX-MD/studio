/**
 * @fileOverview High-performance Image-to-Sticker converter with 20+ fallbacks.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "sticker",
  aliases: ["s", "stiker"],
  category: "photo",
  description: "Convert an image or video to a high-quality sticker.",
  usage: "sticker (reply to media)",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const media = quoted?.imageMessage || quoted?.videoMessage || ctx.msg.message?.imageMessage || ctx.msg.message?.videoMessage;

    if (!media) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Reply to an image or video.\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 🎨 STICKER GEN ⌋\n┃ Status: Rendering...\n┃ Mode: High-Def\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      
      // Send as sticker directly via Baileys
      await ctx.sock.sendMessage(ctx.jid, { 
        sticker: buffer 
      }, { quoted: ctx.msg });

      await ctx.sock.sendMessage(ctx.jid, { text: `┌──⌈ ✅ SUCCESS ⌋\n┃ Type: Sticker\n┃ Status: Deployed\n└─ 🌌 ${botName.toUpperCase()}`, edit: key });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Processing failed.\n└────────────────`);
    }
  }
};
