/**
 * @fileOverview Blacklist a user.
 */
import { ROLES } from '../../../configs/permissions.js';

export default {
  name: "bansudo",
  category: "sudo",
  description: "Blacklist a user from using the bot.",
  usage: "!bansudo <tag/reply>",
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
    await ctx.bot.db.set('users', userId, { role: ROLES.BLACKLISTED });

    const output = `┌──⌈ BLACKLIST ⌋
┃ Target: @${userId}
┃ Action: Permanent Ban
┃ Status: Restricted
└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
    
    await ctx.sock.sendMessage(target, { 
      text: `┌──⌈ SYSTEM ALERT ⌋\n┃ You have been blacklisted from AstraX.\n└────────────────` 
    }).catch(() => {});
  }
};