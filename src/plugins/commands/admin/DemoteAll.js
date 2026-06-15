/**
 * @fileOverview Demote all admins.
 */
export default {
  name: "demoteall",
  aliases: ["unadminall"],
  category: "admin",
  description: "Remove administrative status from all admins (except creator).",
  usage: "!demoteall",
  permissions: 9,
  groupOnly: true,
  execute: async (ctx) => {
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const targets = metadata.participants.filter(p => p.admin && p.admin !== 'superadmin').map(p => p.id);

    if (targets.length === 0) return ctx.reply("┌──⌈ ERROR ⌋\n┃ No admins to demote.\n└────────────────");

    ctx.reply(`┌──⌈ MASS DEMOTE ⌋\n┃ Action: Demoting ${targets.length} admins\n└────────────────`);

    for (const target of targets) {
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], "demote").catch(() => {});
      await new Promise(r => setTimeout(r, 500));
    }
  }
};