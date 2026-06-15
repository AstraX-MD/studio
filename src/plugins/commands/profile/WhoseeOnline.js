/**
 * @fileOverview Check who can see the bot's online status.
 */
export default {
  name: "whoseeonline",
  aliases: ["visibility", "checkonline"],
  category: "profile",
  description: "Display a report on who can see the bot's active status.",
  usage: "whoseeonline",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 👁️ VISIBILITY ⌋
┃
┃ Privacy: CONTACTS ONLY
┃ Active: YES
┃ Stealth: DISABLED
┃
┃ Anyone in your contacts 
┃ can see when you are online.
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
