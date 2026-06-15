/**
 * @fileOverview Change group description.
 */
export default {
  name: "setdesc",
  aliases: ["setdescription", "gcdesc"],
  category: "admin",
  description: "Update the group description.",
  usage: "!setdesc <new description>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const desc = args.join(' ');
    if (!desc) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Content missing.\n└────────────────");
    try {
      await ctx.sock.groupUpdateDescription(ctx.jid, desc);
      ctx.reply(`┌──⌈ DESC UPDATED ⌋\n┃ Action: Update Success\n└────────────────`);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Execution failed.\n└────────────────");
    }
  }
};