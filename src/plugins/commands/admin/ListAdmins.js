/**
 * @fileOverview List all admins.
 */
export default {
  name: "listadmins",
  aliases: ["admins", "staff"],
  category: "admin",
  description: "List all administrators in the group.",
  usage: "!listadmins",
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const admins = metadata.participants.filter(p => p.admin);

    let output = `┌──⌈ GROUP STAFF ⌋\n┃ Total: ${admins.length}\n└────────────────\n\n`;
    admins.forEach((adm, i) => {
      output += `┃ ${i + 1}. @${adm.id.split('@')[0]} [${adm.admin === 'superadmin' ? 'Owner' : 'Admin'}]\n`;
    });
    output += `└────────────────`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: admins.map(a => a.id) });
  }
};