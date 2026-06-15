/**
 * @fileOverview Get group invite link.
 */
export default {
  name: "grouplink",
  aliases: ["link"],
  category: "admin",
  description: "Retrieve the current group invite link.",
  usage: "grouplink",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      const code = await ctx.sock.groupInviteCode(ctx.jid);
      ctx.reply(`┌──⌈ 🔗 GROUP LINK ⌋
┃ Link: https://chat.whatsapp.com/${code}
┃ Status: Secure & Active
└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Failed to fetch link.\n└────────────────`);
    }
  }
};