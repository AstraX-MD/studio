/**
 * @fileOverview Dynamic Help Menu generator.
 */
import { ROLE_NAMES } from '../../../configs/permissions.js';

export default {
  name: "help",
  aliases: ["h", "menu"],
  category: "utility",
  description: "Display the command list and detailed help for specific commands.",
  usage: "!help [command]",
  cooldown: 5,
  permissions: 1, // USER
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    // Detailed Help for specific command
    if (args.length > 0) {
      const command = ctx.bot.commands.get(args[0].toLowerCase());
      if (!command) return ctx.reply(`❌ Command *${args[0]}* not found.`);

      let helpText = `*COMMAND INFO: ${command.name.toUpperCase()}*\n\n`;
      helpText += `> 📝 *Desc:* ${command.description}\n`;
      helpText += `> 📂 *Category:* ${command.category}\n`;
      helpText += `> ⌨️ *Usage:* ${command.usage}\n`;
      if (command.aliases) helpText += `> 🖇️ *Aliases:* ${command.aliases.join(', ')}\n`;
      helpText += `> ⏳ *Cooldown:* ${command.cooldown || 3}s\n`;
      helpText += `> 🛡️ *Min Rank:* ${ROLE_NAMES[command.permissions || 1]}\n`;
      
      return ctx.reply(helpText);
    }

    // Main Menu
    const commands = Array.from(ctx.bot.commands.values());
    const categories = [...new Set(commands.map(cmd => cmd.category))];
    
    let menu = `> ╭─────〔 ${ctx.bot.config.name.toUpperCase()} MENU 〕─────┈⊷\n`;
    menu += `> │ 𐂂 Prefix: [ ${prefix} ]\n`;
    menu += `> │ 𐂂 Mode: ${await ctx.bot.managers.settings.isMaintenance() ? 'Maintenance' : 'Public'}\n`;
    menu += `> ╰─────────────────────────⊷\n\n`;

    for (const cat of categories.sort()) {
      const catCmds = commands
        .filter(cmd => cmd.category === cat && !cmd.aliases?.includes(cmd.name))
        .map(cmd => `\`${cmd.name}\``)
        .join(', ');
      
      if (catCmds) {
        menu += `*${cat.toUpperCase()}*\n${catCmds}\n\n`;
      }
    }

    menu += `_Type !help <command> for details._\n${ctx.bot.config.footer}`;
    
    await ctx.reply(menu);
  }
};
