/**
 * @fileOverview Change group name.
 */
export default {
  name: "setname",
  aliases: ["settitle", "gcname"],
  category: "admin",
  description: "Update the group chat name.",
  usage: "!setname <new name>",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const name = args.join(' ');
    if (!name) return ctx.reply("┌──⌈ ERROR ⌋\n┃ Name missing.\n└────────────────");
    try {
      await ctx.sock.groupUpdateSubject(ctx.jid, name);
      ctx.reply(`┌──⌈ NAME UPDATED ⌋\n┃ New Name: ${name}\n└────────────────`);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Execution failed.\n└────────────────");
    }
  }
};