/**
 * @fileOverview Specialized Music Menu.
 */
export default {
  name: "musicmenu",
  aliases: ["mmenu"],
  category: "music",
  description: "Display all music search and download tools.",
  usage: "musicmenu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => (cmd.category === 'music' || cmd.category === 'ai-song') && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 🎵 MUSIC HUB ⌋\n┃\n`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
