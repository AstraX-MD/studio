/**
 * @fileOverview Allow everyone to edit group settings.
 */
export default {
  name: "unlock",
  category: "admin",
  description: "Allow everyone to change group information.",
  usage: "unlock",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupSettingUpdate(ctx.jid, "unlocked");
      ctx.reply(`┌──⌈ 🔓 SETTINGS UNLOCK ⌋
┃ Status: Disabled
┃ Target: Everyone
└────────────────`);
    } catch (e) {
      ctx.reply(`┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────`);
    }
  }
};