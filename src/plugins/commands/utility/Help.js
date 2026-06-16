/**
 * @fileOverview AstraX Master Menu.
 */
export default {
  name: "help",
  aliases: ["menu", "commands"],
  category: "utility",
  description: "Display all available commands organized by category.",
  usage: "help",
  permissions: 1,
  execute: async (ctx) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
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

    const totalUnique = uniqueCommands.length;
    const totalTriggers = ctx.bot.commands.size;

    let output = `┌──⌈ 🌌 ASTRAX ⌋
┃ User: ${ctx.pushName}
┃ Unique Modules: ${totalUnique}
┃ Active Triggers: ${totalTriggers}
┃
`;

    const displayOrder = ['admin', 'ai-chat', 'ai-image', 'ai-video', 'ai-music', 'economy', 'downloaders', 'logos', 'reactions', 'tools', 'security', 'utility'];
    
    displayOrder.forEach(cat => {
      if (categories[cat]) {
        output += `├─⌈ ${cat.toUpperCase()} ⌋\n┃ ${categories[cat].map(n => prefix + n).join(', ')}\n┃\n`;
      }
    });

    output += `└─ AstraX System`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: ctx.bot.config.thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};