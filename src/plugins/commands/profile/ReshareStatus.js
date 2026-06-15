/**
 * @fileOverview Repost a status update to the bot's own status.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "resharestatus",
  aliases: ["repost", "statusforward"],
  category: "profile",
  description: "Reshare someone's status media to your own status.",
  usage: "resharestatus (reply to status)",
  permissions: 9,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Reply to a status media.\n└────────────────");

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      const type = quoted.imageMessage ? 'image' : 'video';

      await ctx.sock.sendMessage('status@broadcast', {
        [type]: buffer,
        caption: `Reshared via ${botName}`
      }, { statusJidList: [ctx.sender] });

      ctx.reply(`┌──⌈ ♻️ RESHARED ⌋\n┃ Status: Posted to Story\n┃ Target: Global Contacts\n└─ 🌌 ${botName.toUpperCase()}`);
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Reshare failed.\n└────────────────");
    }
  }
};
