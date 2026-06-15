/**
 * @fileOverview Purge the group of all non-admin members.
 */
export default {
  name: "kickall",
  category: "admin",
  description: "Remove all non-admin members from the group.",
  usage: "kickall",
  permissions: 10,
  groupOnly: true,
  execute: async (ctx) => {
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const targets = metadata.participants.filter(p => !p.admin).map(p => p.id);

    if (targets.length === 0) return ctx.reply(`┌──⌈ ERROR ⌋\n┃ No targets identified.\n└────────────────`);

    ctx.reply(`┌──⌈ ☢️ GROUP PURGE ⌋\n┃ Removing ${targets.length} members...\n┃ This may take a while.\n└────────────────`);

    for (const target of targets) {
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], "remove").catch(() => {});
      await new Promise(r => setTimeout(r, 1500));
    }
    ctx.reply(`┌──⌈ COMPLETE ⌋\n┃ Group purge successful.\n└────────────────`);
  }
};