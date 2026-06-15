/**
 * @fileOverview Get group invite link.
 */
export default {
  name: "grouplink",
  aliases: ["linkgc", "link"],
  category: "admin",
  description: "Retrieve the current group invite link.",
  usage: "!grouplink",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      const code = await ctx.sock.groupInviteCode(ctx.jid);
      const output = `┌──⌈ GROUP LINK ⌋
┃ Link: https://chat.whatsapp.com/${code}
┃ Status: Active
└────────────────`;
      await ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Failed to fetch link.\n└────────────────");
    }
  }
};