/**
 * @fileOverview Specialized Stalker Menu.
 */
export default {
  name: "stalkermenu",
  aliases: ["smenu"],
  category: "stalker",
  description: "Display all OSINT and profile auditing tools.",
  usage: "stalkermenu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => cmd.category === 'stalker' && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 🕵️ STALKER ⌋\n┃\n`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
