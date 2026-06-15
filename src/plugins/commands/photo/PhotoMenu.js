/**
 * @fileOverview Specialized Photo Editor Menu.
 */
export default {
  name: "photomenu",
  aliases: ["pmenu"],
  category: "photo",
  description: "Display all photo editing and filtering commands.",
  usage: "photomenu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => cmd.category === 'photo' && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 📸 PHOTO ENGINE ⌋\n┃\n`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
