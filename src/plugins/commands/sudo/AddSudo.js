/**
 * @fileOverview Add a user to the SUDO role.
 */
import { ROLES } from '../../../configs/permissions.js';

export default {
  name: "addsudo",
  category: "sudo",
  description: "Promote a user to SUDO admin rank.",
  usage: "!addsudo <tag/reply/number>",
  permissions: 9, // OWNER+
  execute: async (ctx, args) => {
    let target;
    
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }

    if (!target) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Please tag a user or reply to a message.\n└────────────────");

    const userId = target.split('@')[0];
    await ctx.bot.db.set('users', userId, { role: ROLES.SUDO });

    const output = `┌──⌈ SUDO UPDATED ⌋
┃ Target: @${userId}
┃ Action: Promoted to SUDO
┃ Status: Authorized
└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
    
    // Notify the user
    await ctx.sock.sendMessage(target, { 
      text: `┌──⌈ PERMISSION UPDATE ⌋\n┃ You have been promoted to SUDO.\n┃ You now have elevated access.\n└────────────────` 
    }).catch(() => {});
  }
};