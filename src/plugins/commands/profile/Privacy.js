/**
 * @fileOverview Show current bot privacy settings.
 */
export default {
  name: "privacy",
  category: "profile",
  description: "Display the bot's active privacy configuration.",
  usage: "privacy",
  permissions: 9,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 🔐 PRIVACY ⌋
┃
┃ Group: EVERYONE
┃ Status: CONTACTS
┃ Profile: EVERYONE
┃ Read: ENABLED
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
