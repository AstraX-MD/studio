/**
 * @fileOverview Secret crush detector.
 */
export default {
  name: "crush",
  category: "fun-advanced",
  description: "Discover who has a secret crush on you (Simulated).",
  usage: "crush",
  cooldown: 10,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const participants = metadata.participants.map(p => p.id).filter(id => id !== ctx.sender);
    const target = participants[Math.floor(Math.random() * participants.length)];

    const output = `┌──⌈ 💌 SECRET CRUSH ⌋
┃ 
┃ User: @${ctx.sender.split('@')[0]}
┃ 
┃ Someone is watching you...
┃ 
├─⊷ It's @${target.split('@')[0]}!
├─⊷ Level: 87% (OBSESSED)
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, target] });
  }
};
