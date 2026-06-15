/**
 * @fileOverview Set group to admins only.
 */
export default {
  name: "mute",
  aliases: ["closegc", "lockgroup"],
  category: "admin",
  description: "Allow only admins to send messages in the group.",
  usage: "!mute",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupSettingUpdate(ctx.jid, "announcement");
      const output = `┌──⌈ GROUP SETTINGS ⌋
┃ Action: Muted Group
┃ Target: All Members
┃ Status: Admin Only
└────────────────`;
      await ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};