/**
 * @fileOverview Detailed command module statistics.
 */
export default {
  name: "modulestats",
  aliases: ["cms", "auditcmds"],
  category: "utility",
  description: "Expert audit of command modules and entry points.",
  usage: "modulestats",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const uniqueCount = new Set(ctx.bot.commands.values()).size;
    const triggerCount = ctx.bot.commands.size;

    const output = `┌──⌈ 📊 MODULE AUDIT ⌋
┃
┃ Unique Modules: ${uniqueCount}
┃ (Individual command files)
┃
┃ Entry Points: ${triggerCount}
┃ (Names + All Aliases)
┃
├─⊷ Status: NODE_STABLE
├─⊷ Engine: AstraX Core
┃
┃ v1.2.5 is operating at
┃ peak performance.
└────────────────`;
    ctx.reply(output);
  }
};
