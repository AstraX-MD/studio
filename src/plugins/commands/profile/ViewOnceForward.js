/**
 * @fileOverview Silent View-Once recovery directly to the sender's DM.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "vv2",
  aliases: ["vvf", "silentvv"],
  category: "profile",
  description: "Recover and forward View-Once media directly to your DM (Silent).",
  usage: "vv2 (reply to view-once)",
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

      // Forward directly to the sender's JID in private
      await ctx.sock.sendMessage(ctx.sender, { 
        [type]: buffer, 
        caption: `┌──⌈ 🕵️ SILENT VV ⌋\n┃ Forwarded from: ${ctx.isGroup ? 'Group' : 'DM'}\n└─ 🌌 ${botName.toUpperCase()}` 
      });

      // Confirm in current chat with an emoji reaction to keep it low-key
      await ctx.react('✅');
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Forwarding failed.\n└────────────────");
    }
  }
};
