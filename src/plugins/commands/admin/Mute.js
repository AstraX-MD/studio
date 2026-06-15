/**
 * @fileOverview Restrict message sending to admins only.
 */
export default {
  name: "mute",
  aliases: ["close", "lockgc"],
  category: "admin",
  description: "Allow only admins to send messages in the group.",
  usage: "mute",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupSettingUpdate(ctx.jid, "announcement");
      ctx.reply(`┌──⌈ 🔇 GROUP MUTE ⌋
┃ Status: Admin Only
┃ Action: Chat Closed
└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────`);
    }
  }
};