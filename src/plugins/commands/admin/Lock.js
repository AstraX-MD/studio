/**
 * @fileOverview Prevent non-admins from editing group settings.
 */
export default {
  name: "lock",
  aliases: ["lockgc", "locksettings"],
  category: "admin",
  description: "Only admins can change group info (Name/Icon/Desc).",
  usage: "!lock",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupSettingUpdate(ctx.jid, "locked");
      ctx.reply(`┌──⌈ SETTINGS ⌋\n┃ Status: Locked\n┃ Target: Non-Admins\n└────────────────`);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};