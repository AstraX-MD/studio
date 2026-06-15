/**
 * @fileOverview Demote a user from SUDO rank.
 */
import { ROLES } from '../../../configs/permissions.js';

export default {
  name: "delsudo",
  category: "sudo",
  description: "Demote a user from SUDO rank to standard user.",
  usage: "!delsudo <tag/reply/number>",
  permissions: 9, 
  execute: async (ctx, args) => {
    let target;
    
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }

    if (!target) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Target not identified.\n└────────────────");

    const userId = target.split('@')[0];
    await ctx.bot.db.set('users', userId, { role: ROLES.USER });

    const output = `┌──⌈ SUDO UPDATED ⌋
┃ Target: @${userId}
┃ Action: Demoted to USER
┃ Status: Revoked
└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
    
    await ctx.sock.sendMessage(target, { 
      text: `┌──⌈ PERMISSION UPDATE ⌋\n┃ Your SUDO access has been revoked.\n└────────────────` 
    }).catch(() => {});
  }
};