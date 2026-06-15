/**
 * @fileOverview Find your soulmate in the group.
 */
export default {
  name: "soulmate",
  category: "fun-advanced",
  description: "Identify your random soulmate within the current group.",
  usage: "soulmate",
  cooldown: 15,
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const participants = metadata.participants.map(p => p.id).filter(id => id !== ctx.sender);
    
    const soulmate = participants[Math.floor(Math.random() * participants.length)];

    const output = `┌──⌈ ✨ SOULMATE ⌋
┃ 
┃ Searching the stars...
┃ 
┃ @${ctx.sender.split('@')[0]} ❤️ @${soulmate.split('@')[0]}
┃ 
├─⊷ Bond: UNBREAKABLE
├─⊷ Destiny: WRITTEN
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, soulmate] });
  }
};
