/**
 * @fileOverview Update the bot's profile picture.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "setpp",
  aliases: ["updatepp", "deploypp"],
  category: "profile",
  description: "Update the bot's profile picture from a replied image.",
  usage: "setpp (reply to image)",
  permissions: 9,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.imageMessage) {
      return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Please reply to an image.\n└────────────────`);
    }

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      await ctx.sock.updateProfilePicture(ctx.sock.user.id, buffer);
      
      const output = `┌──⌈ 📸 ICON DEPLOYED ⌋
┃
┃ Target: Bot Identity
┃ Status: Active
┃ Scope: Global Profile
┃
┃ Success: New PP applied.
└────────────────
  © ${botName.toUpperCase()}`;
      
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to deploy profile picture.\n└────────────────`);
    }
  }
};
