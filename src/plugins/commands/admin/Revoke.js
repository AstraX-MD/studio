/**
 * @fileOverview Reset group invite link.
 */
export default {
  name: "revoke",
  aliases: ["resetlink", "revokelink"],
  category: "admin",
  description: "Invalidate the current link and generate a new one.",
  usage: "!revoke",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupRevokeInvite(ctx.jid);
      const code = await ctx.sock.groupInviteCode(ctx.jid);
      const output = `┌──⌈ LINK REVOKED ⌋
┃ Action: Link Reset
┃ New Link: chat.whatsapp.com/${code}
┃ Status: Secure
└────────────────`;
      await ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};