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
    const totalUnique = new Set(ctx.bot.commands.values()).size;
    const totalTriggers = ctx.bot.commands.size;

    const output = `┌──⌈ 📊 MODULE AUDIT ⌋
┃ 
┃ Unique Logic: ${totalUnique} Files
┃ Active Triggers: ${totalTriggers} (inc. Aliases)
┃ 
┃ Note: Unique modules are 
┃ the actual code files. 
┃ Triggers include every 
┃ alternative name.
┃
└─ AstraX System`;
    ctx.reply(output);
  }
};