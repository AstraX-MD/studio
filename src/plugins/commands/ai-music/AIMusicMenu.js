/**
 * @fileOverview Specialized AI Music Menu.
 */
export default {
  name: "aimusicmenu",
  aliases: ["aimusic", "aisongmenu"],
  category: "ai-music",
  description: "Display all AI audio and song creation tools.",
  usage: "aimusicmenu",
  permissions: 1,
  execute: async (ctx) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => cmd.category === 'ai-music' && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 🎵 AI MUSIC ⌋\n┃\n`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ AstraX System`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: ctx.bot.config.thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};