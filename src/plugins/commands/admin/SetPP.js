/**
 * @fileOverview Change group profile picture.
 */
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
  name: "setppgc",
  aliases: ["seticon"],
  category: "admin",
  description: "Update group icon from a replied photo.",
  usage: "setppgc (reply to image)",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.imageMessage) return ctx.reply(`┌──⌈ ERROR ⌋\n┃ Reply to an image.\n└────────────────`);

    try {
      const buffer = await downloadMediaMessage(ctx.msg, 'buffer', {});
      await ctx.sock.updateProfilePicture(ctx.jid, buffer);
      ctx.reply(`┌──⌈ 📸 ICON UPDATED ⌋\n┃ Status: Success\n└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Failed to update icon.\n└────────────────`);
    }
  }
};