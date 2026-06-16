/**
 * @fileOverview Specialized AI Video Menu.
 */
export default {
  name: "aivideomenu",
  aliases: ["aivideo"],
  category: "ai-video",
  description: "Display all AI video generation tools.",
  usage: "aivideomenu",
  permissions: 1,
  execute: async (ctx) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => cmd.category === 'ai-video' && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 🎥 AI VIDEOS ⌋\n┃\n`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ AstraX System`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: ctx.bot.config.thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};