/**
 * @fileOverview Allow everyone to edit group settings.
 */
export default {
  name: "unlock",
  aliases: ["unlockgc", "unlocksettings"],
  category: "admin",
  description: "Everyone can change group info (Name/Icon/Desc).",
  usage: "!unlock",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    try {
      await ctx.sock.groupSettingUpdate(ctx.jid, "unlocked");
      ctx.reply(`┌──⌈ SETTINGS ⌋\n┃ Status: Unlocked\n┃ Target: Everyone\n└────────────────`);
    } catch (e) {
      ctx.reply("┌──⌈ ERROR ⌋\n┃ Operation failed.\n└────────────────");
    }
  }
};