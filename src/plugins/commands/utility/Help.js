/**
 * @fileOverview Dynamic Help Menu with WolfBot Box Styling.
 */
import os from 'os';

export default {
  name: "help",
  aliases: ["h", "menu"],
  category: "utility",
  description: "Display the command list.",
  usage: "!help",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const mem = process.memoryUsage();
    const totalMem = os.totalmem() || 1;
    const ramPercent = ((mem.rss / totalMem) * 100).toFixed(0);

    let menu = `┌──⌈ ${ctx.bot.config.name.toUpperCase()} ⌋
┃ User: ${ctx.pushName}
┃ Mode: ${await ctx.bot.managers.settings.isMaintenance() ? 'Maintenance' : 'Public'}
┃ Prefix: [ ${prefix} ]
┃ Status: Active
┃ RAM: ${ramPercent}%
└────────────────\n\n`;

    const commands = Array.from(ctx.bot.commands.values());
    const categories = [...new Set(commands.map(cmd => cmd.category))];

    for (const cat of categories.sort()) {
      const catCmds = commands
        .filter(cmd => cmd.category === cat && cmd.name === (cmd.aliases?.[0] || cmd.name))
        .map(cmd => cmd.name);
      
      if (catCmds.length > 0) {
        menu += `┌──⌈ ${cat.toUpperCase()} ⌋\n`;
        catCmds.forEach(cmd => {
          menu += `┃ ${cmd}\n`;
        });
        menu += `└───────────────\n\n`;
      }
    }

    menu += `_Type ${prefix}help <command> for details._`;
    await ctx.reply(menu);
  }
};