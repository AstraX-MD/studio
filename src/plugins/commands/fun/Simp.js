/**
 * @fileOverview Simp meter (Fun).
 */
export default {
  name: "simp",
  category: "fun",
  description: "Calculate how much of a simp someone is.",
  usage: "simp <tag>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const percent = Math.floor(Math.random() * 101);

    const output = `┌──⌈ 💘 SIMP METER ⌋
┃ Target: @${target.split('@')[0]}
┃ Result: ${percent}%
┃ Status: ${percent > 50 ? 'CERTIFIED SIMP' : 'SIGMA STATUS'}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
