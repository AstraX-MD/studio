/**
 * @fileOverview IQ Meter (Fun).
 */
export default {
  name: "iq",
  category: "fun",
  description: "Calculate a user's IQ (Fun Meter).",
  usage: "iq <tag>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const iq = Math.floor(Math.random() * 160) + 40;

    const output = `┌──⌈ 🧠 IQ METER ⌋
┃ Target: @${target.split('@')[0]}
┃ Intelligence: ${iq}
┃ Status: ${iq > 120 ? 'GENIUS' : iq > 90 ? 'AVERAGE' : 'STUPID'}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
