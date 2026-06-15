/**
 * @fileOverview Specialized NSFW Menu.
 */
export default {
  name: "nsfwmenu",
  aliases: ["adultmenu", "xmenu"],
  category: "nsfw",
  description: "Display all mature and adult-oriented commands.",
  usage: "nsfwmenu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const isEnabled = await ctx.bot.db.get('settings', `nsfw_enabled:${ctx.jid}`) || false;

    const commands = Array.from(ctx.bot.commands.values())
      .filter(cmd => cmd.category === 'nsfw' && !cmd.name.endsWith('menu'))
      .map(cmd => cmd.name);

    let output = `┌──⌈ 🔞 NSFW MATRIX ⌋
┃ Mode: ${isEnabled ? '✅ ENABLED' : '❌ DISABLED'}
┃ Warning: 18+ Only
┃
`;
    commands.forEach(cmd => output += `├─⊷ ${prefix}${cmd}\n`);
    output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
