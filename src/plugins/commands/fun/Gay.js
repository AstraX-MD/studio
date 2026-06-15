/**
 * @fileOverview Gay meter (Fun).
 */
export default {
  name: "gay",
  category: "fun",
  description: "Calculate how gay someone is (Fun Meter).",
  usage: "gay <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    // Use string to ensure same result per user instance (Mock)
    const percent = Math.floor(Math.random() * 101);

    const output = `┌──⌈ 🌈 GAY METER ⌋
┃ Target: @${target.split('@')[0]}
┃ Result: ${percent}%
┃ Status: ${percent > 50 ? 'GAY AS HELL' : 'STRAIGHT AF'}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
