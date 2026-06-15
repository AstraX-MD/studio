/**
 * @fileOverview Allow everyone to send messages.
 */
export default {
  name: "unmute",
  aliases: ["open", "unlockgc"],
  category: "admin",
  description: "Allow all members to send messages in the group.",
  usage: "unmute",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupSettingUpdate(ctx.jid, "not_announcement");
      ctx.reply(`┌──⌈ 🔊 GROUP UNMUTE ⌋
┃ Status: Open for All
┃ Action: Chat Opened
└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────`);
    }
  }
};