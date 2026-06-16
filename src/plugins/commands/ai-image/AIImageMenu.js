/**
 * @fileOverview Specialized AI Image Menu.
 */
export default {
  name: "aiimagemenu",
  aliases: ["aimage"],
  category: "ai-image",
  description: "Display all text-to-image AI generators.",
  usage: "aiimagemenu",
  permissions: 1,
  execute: async (ctx) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => cmd.category === 'ai-image' && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 🎨 AI IMAGES ⌋\n┃\n`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ AstraX System`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: ctx.bot.config.thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};