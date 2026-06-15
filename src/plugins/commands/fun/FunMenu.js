/**
 * @fileOverview Specialized Fun Menu.
 */
export default {
  name: "funmenu",
  category: "fun",
  description: "Display all entertainment and social commands.",
  usage: "funmenu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => (cmd.category === 'fun' || cmd.category === 'fun-advanced') && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 😂 FUN CENTER ⌋\n┃\n`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
