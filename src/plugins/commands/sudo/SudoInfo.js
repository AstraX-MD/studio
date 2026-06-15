/**
 * @fileOverview View permissions for a specific user.
 */
import { ROLE_NAMES } from '../../../configs/permissions.js';

export default {
  name: "sudoinfo",
  category: "sudo",
  description: "Check a user's permission rank and status.",
  usage: "!sudoinfo <tag/reply>",
  permissions: 8,
  execute: async (ctx, args) => {
    let target;
    
    if (ctx.msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.participant;
    } else if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      target = ctx.sender;
    }

    const role = await ctx.bot.managers.roles.getRole(target);
    const roleName = ROLE_NAMES[role] || 'Unknown';

    const output = `┌──⌈ USER PERMISSIONS ⌋
┃ Target: @${target.split('@')[0]}
┃ Rank: ${roleName}
┃ Level: ${role}
┃ Status: ${role > 0 ? 'Active' : 'Blacklisted'}
└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};