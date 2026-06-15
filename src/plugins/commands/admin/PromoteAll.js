/**
 * @fileOverview Promote all members.
 */
export default {
  name: "promoteall",
  aliases: ["adminall"],
  category: "admin",
  description: "Make every member of the group an administrator.",
  usage: "!promoteall",
  permissions: 9, // OWNER+
  groupOnly: true,
  execute: async (ctx) => {
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const targets = metadata.participants.filter(p => !p.admin).map(p => p.id);

    if (targets.length === 0) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Everyone is already admin.\n└────────────────");

    ctx.reply(`┌──⌈ MASS PROMOTE ⌋\n┃ Action: Promoting ${targets.length} members\n└────────────────`);

    for (const target of targets) {
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], "promote").catch(() => {});
      await new Promise(r => setTimeout(r, 500));
    }
  }
};