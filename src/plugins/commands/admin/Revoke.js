/**
 * @fileOverview Reset group invite link.
 */
export default {
  name: "revoke",
  aliases: ["resetlink"],
  category: "admin",
  description: "Invalidate the current link and generate a new one.",
  usage: "revoke",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupRevokeInvite(ctx.jid);
      const code = await ctx.sock.groupInviteCode(ctx.jid);
      ctx.reply(`┌──⌈ ♻️ REVOKE ⌋
┃ Action: Link Reset
┃ New Link: https://chat.whatsapp.com/${code}
└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────`);
    }
  }
};