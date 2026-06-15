/**
 * @fileOverview Prank death timer.
 */
export default {
  name: "death",
  category: "fun",
  description: "Calculate your fictional death date (Prank).",
  usage: "death <tag>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const years = Math.floor(Math.random() * 80) + 1;
    const cause = ['Laughter', 'Coffee Overdose', 'Staring at Eclipse', 'Gaming Marathon', 'Falling Toast'];

    const output = `┌──⌈ 💀 DEATH CLOCK ⌋
┃ Target: @${target.split('@')[0]}
┃ 
├─ Time: ${years} Years Left
├─ Cause: ${cause[Math.floor(Math.random() * cause.length)]}
├─ Status: INEVITABLE
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
