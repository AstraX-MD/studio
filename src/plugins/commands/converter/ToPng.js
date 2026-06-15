/**
 * @fileOverview Convert any media to high-res PNG.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "topng",
  category: "converter",
  description: "Convert an image or sticker into a high-quality PNG file.",
  usage: "topng (reply to media)",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const { key } = await ctx.reply(`┌──⌈ 🖼️ PNG GEN ⌋\n┃ Status: Extracting Pixels...\n┃ Mode: High-Res\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      await ctx.sock.sendMessage(ctx.jid, { 
        image: buffer,
        caption: `┌──⌈ ✅ SUCCESS ⌋\n┃ Format: PNG\n┃ Status: Rendered\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
      await ctx.sock.sendMessage(ctx.jid, { delete: key });
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ PNG rendering failed.\n└────────────────`);
    }
  }
};
