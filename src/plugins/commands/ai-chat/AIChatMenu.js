/**
 * @fileOverview Specialized AI Chat Menu with Redundancy Counters.
 */
export default {
  name: "aimenu",
  aliases: ["aichatmenu", "aimatrix"],
  category: "ai-chat",
  description: "Display all artificial intelligence models and web-tools.",
  usage: "aimenu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => (cmd.category === 'ai-chat' || cmd.category === 'ai-image' || cmd.category === 'ai-video' || cmd.category === 'ai-song') && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 🤖 AI MATRIX ⌋
┃ User: ${ctx.pushName}
┃ Nodes: 40+ Fallbacks
┃ Status: CLOUD-STABLE
┃
`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n┃ New: ${prefix}webgen (Live Apps)
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
