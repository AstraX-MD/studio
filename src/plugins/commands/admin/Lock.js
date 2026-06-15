/**
 * @fileOverview Prevent non-admins from editing group settings.
 */
export default {
  name: "lock",
  category: "admin",
  description: "Only admins can change group information.",
  usage: "lock",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupSettingUpdate(ctx.jid, "locked");
      ctx.reply(`┌──⌈ 🔒 SETTINGS LOCK ⌋
┃ Status: Active
┃ Target: Non-Admins
└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────`);
    }
  }
};