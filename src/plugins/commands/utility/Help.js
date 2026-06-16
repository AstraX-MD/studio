/**
 * @fileOverview Main Menu.
 */
export default {
  name: "help",
  aliases: ["menu", "commands"],
  category: "utility",
  description: "Show all commands.",
  usage: "help",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const commands = Array.from(ctx.bot.commands.values());
    const seen = new Set();
    const uniqueCommands = commands.filter(c => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });

    const categories = {};
    uniqueCommands.forEach(cmd => {
      const cat = cmd.category || 'general';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.name);
    });

    let output = `┌──⌈ ${botName.toUpperCase()} ⌋
┃ User: ${ctx.pushName}
┃ Prefix: [ ${prefix} ]
┃ Modules: ${uniqueCount}
┃ 
`;

    const displayOrder = ['admin', 'ai-chat', 'ai-image', 'economy', 'downloaders', 'logos', 'reactions', 'tools', 'security', 'utility'];
    
    displayOrder.forEach(cat => {
      if (categories[cat]) {
        output += `├─⌈ ${cat.toUpperCase()} ⌋\n┃ ${categories[cat].map(n => prefix + n).join(', ')}\n┃\n`;
      }
    });

    output += `└─ AstraX System`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};