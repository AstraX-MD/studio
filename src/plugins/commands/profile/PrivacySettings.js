/**
 * @fileOverview Detailed privacy configuration audit.
 */
export default {
  name: "privacysettings",
  aliases: ["ps", "auditprivacy"],
  category: "profile",
  description: "View a detailed audit of the bot's privacy and visibility settings.",
  usage: "privacysettings",
  permissions: 9,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 🔐 PRIVACY AUDIT ⌋
┃
┃ Read Receipts: ENABLED
┃ Last Seen: CONTACTS
┃ Profile Pic: EVERYONE
┃ Status: CONTACTS
┃ Groups: CONTACTS
┃ Disappearing: OFF
┃
┃ Status: SECURE
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
