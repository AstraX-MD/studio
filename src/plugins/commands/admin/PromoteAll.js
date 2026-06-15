/**
 * @fileOverview Promote every member to administrator.
 */
export default {
  name: "promoteall",
  category: "admin",
  description: "Make every member an administrator.",
  usage: "promoteall",
  permissions: 9,
  groupOnly: true,
  execute: async (ctx) => {
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const targets = metadata.participants.filter(p => !p.admin).map(p => p.id);

    if (targets.length === 0) return ctx.reply(`┌──⌈ ERROR ⌋\n┃ Everyone is already admin.\n└────────────────`);

    ctx.reply(`┌──⌈ 📈 MASS PROMOTE ⌋\n┃ Promoting ${targets.length} users...\n└────────────────`);

    for (const target of targets) {
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], "promote").catch(() => {});
      await new Promise(r => setTimeout(r, 800));
    }
    ctx.reply(`┌──⌈ SUCCESS ⌋\n┃ Everyone is now Admin.\n└────────────────`);
  }
};