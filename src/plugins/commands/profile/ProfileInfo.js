/**
 * @fileOverview Summary of bot profile.
 */
export default {
  name: "profileinfo",
  category: "profile",
  description: "View the bot's public profile summary.",
  usage: "profileinfo",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 🆔 PROFILE INFO ⌋
┃
┃ Name: ${botName}
┃ Owner: AstraRoot
┃ Node: Cloud-Node-01
┃ Platform: Linux/Ubuntu
┃
└─ 🌌 AstraX Enterprise`;
    ctx.reply(output);
  }
};
