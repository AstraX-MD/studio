/**
 * @fileOverview Dynamic Command Auditor.
 */
export default {
  name: "cmdcounts",
  aliases: ["totalcmds", "commandcount"],
  category: "utility",
  description: "Display the exact number of unique commands registered.",
  usage: "cmdcounts",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    // Commands size includes aliases by default in some loaders, 
    // but the AstraX loader maps aliases to the same object. 
    // We use a Set to get unique command objects.
    const totalUnique = new Set(ctx.bot.commands.values()).size;
    const totalWithAliases = ctx.bot.commands.size;

    const output = `┌──⌈ 📊 CMD AUDIT ⌋
┃
┃ Unique Logic: ${totalUnique} Modules
┃ Active Entry: ${totalWithAliases} Trigger Points
┃ Status: NODE-SYNCED
┃
├─⊷ Deployment: 2.4.0-STABLE
├─⊷ Engine: AstraX Core
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
