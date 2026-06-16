/**
 * @fileOverview Command Module Auditor.
 */
export default {
  name: "modulestats",
  aliases: ["cms", "audit"],
  category: "utility",
  description: "View the exact counts for unique logic files vs total command triggers.",
  usage: "modulestats",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    // Unique command objects in the Map
    const totalUnique = new Set(ctx.bot.commands.values()).size;
    // Total trigger points (Name + Aliases)
    const totalTriggers = ctx.bot.commands.size;

    const output = `┌──⌈ 📊 MODULE AUDIT ⌋
┃ 
┃ Unique Logic: ${totalUnique} Files
┃ Active Triggers: ${totalTriggers}
┃ 
┃ Note: Unique modules are 
┃ the actual code files. 
┃ Triggers include every 
┃ alternative name.
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
