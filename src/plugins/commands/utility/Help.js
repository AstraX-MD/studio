/**
 * @fileOverview Main Entry Menu (Help).
 * v1.2.5: Categorized logic with high-end boxed styling.
 */
export default {
  name: "help",
  aliases: ["h", "menu", "commands"],
  category: "utility",
  description: "Display the main command dashboard categorized by function.",
  usage: "help",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
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
┃ Status: ACTIVE
┃ Modules: ${uniqueCommands.length}
┃\n`;

    // Professional Categorization
    const displayCats = ['admin', 'ai-chat', 'ai-image', 'economy', 'downloaders', 'tools', 'security', 'utility'];
    
    displayCats.forEach(cat => {
      if (categories[cat]) {
        output += `├─⌈ ${cat.toUpperCase()} ⌋\n`;
        output += `┃ ${categories[cat].map(n => prefix + n).join(', ')}\n┃\n`;
      }
    });

    output += `└─ 🌌 ${botName.toUpperCase()} Enterprise
   Use ${prefix}allmenu for directory.`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};