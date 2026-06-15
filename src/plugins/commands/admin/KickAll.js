/**
 * @fileOverview Remove all members. DANGEROUS.
 */
export default {
  name: "kickall",
  aliases: ["removeall", "wipegroup"],
  category: "admin",
  description: "Remove all non-admin members from the group.",
  usage: "!kickall",
  permissions: 10, // ROOT ONLY
  groupOnly: true,
  execute: async (ctx) => {
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const targets = metadata.participants.filter(p => !p.admin).map(p => p.id);

    if (targets.length === 0) return ctx.reply("┌──⌈ ERROR ⌋\n┃ No targets identified.\n└────────────────");

    ctx.reply(`┌──⌈ MASS KICK ⌋\n┃ Action: Purging ${targets.length} members\n┃ Status: In Progress\n└────────────────`);

    for (const target of targets) {
      await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], "remove").catch(() => {});
      await new Promise(r => setTimeout(r, 1000));
    }

    ctx.reply("┌──⌈ SUCCESS ⌋\n┃ Group purge complete.\n└────────────────");
  }
};