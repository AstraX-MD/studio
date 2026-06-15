/**
 * @fileOverview List all users with SUDO rank.
 */
import { ROLES } from '../../../configs/permissions.js';

export default {
  name: "listsudo",
  category: "sudo",
  description: "Display all users with elevated SUDO permissions.",
  usage: "!listsudo",
  permissions: 8,
  execute: async (ctx) => {
    const allUsers = await ctx.bot.db.all('users');
    const sudos = Object.keys(allUsers).filter(id => allUsers[id].role === ROLES.SUDO);

    let output = `┌──⌈ SUDO DIRECTORY ⌋\n`;
    if (sudos.length === 0) {
      output += `┃ No custom sudos found.\n`;
    } else {
      sudos.forEach((id, i) => {
        output += `┃ ${i + 1}. @${id}\n`;
      });
    }
    output += `└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: sudos.map(id => id + '@s.whatsapp.net') });
  }
};