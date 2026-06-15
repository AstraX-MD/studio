/**
 * @fileOverview Specialized Security Menu.
 */
export default {
  name: "securitymenu",
  aliases: ["wardenmenu"],
  category: "security",
  description: "Display all Warden Guard protection controls.",
  usage: "securitymenu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => cmd.category === 'security' && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 🛡️ WARDEN ⌋\n┃\n`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
