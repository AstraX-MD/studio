/**
 * @fileOverview Set group to everyone.
 */
export default {
  name: "unmute",
  aliases: ["opengc", "unlockgroup"],
  category: "admin",
  description: "Allow all members to send messages in the group.",
  usage: "!unmute",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupSettingUpdate(ctx.jid, "not_announcement");
      const output = `┌──⌈ GROUP SETTINGS ⌋
┃ Action: Unmuted Group
┃ Target: All Members
┃ Status: Everyone
└────────────────`;
      await ctx.reply(output);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};