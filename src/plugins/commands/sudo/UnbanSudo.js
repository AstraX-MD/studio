/**
 * @fileOverview Unblacklist a user.
 */
import { ROLES } from '../../../configs/permissions.js';

export default {
  name: "unbansudo",
  category: "sudo",
  description: "Remove a user from the blacklist.",
  usage: "!unbansudo <tag/reply>",
  permissions: 9,
  execute: async (ctx, args) => {
    let target;
    
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!target) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Target required.\n└────────────────");

    const userId = target.split('@')[0];
    await ctx.bot.db.set('users', userId, { role: ROLES.USER });

    const output = `┌──⌈ UNBAN ⌋
┃ Target: @${userId}
┃ Action: Ban Removed
┃ Status: Restored
└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
    
    await ctx.sock.sendMessage(target, { 
      text: `┌──⌈ SYSTEM ALERT ⌋\n┃ Your access to AstraX has been restored.\n└────────────────` 
    }).catch(() => {});
  }
};