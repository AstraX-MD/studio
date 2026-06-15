/**
 * @fileOverview (Mock) Save a profile picture to bot archives.
 */
export default {
  name: "savepp",
  category: "profile",
  description: "Archive a user's profile picture to local database.",
  usage: "savepp <tag>",
  permissions: 9,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    ctx.reply(`┌──⌈ 💾 ARCHIVE ⌋\n┃ Task: Save Profile Pic\n┃ Status: Cached\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
