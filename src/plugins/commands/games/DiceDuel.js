/**
 * @fileOverview Dice rolling duel.
 */
export default {
  name: "dice",
  aliases: ["duel"],
  category: "games",
  description: "Roll a pair of dice against the bot or a friend.",
  usage: "dice [@tag]",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let opponent = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 'bot';
    
    const p1 = Math.floor(Math.random() * 6) + 1;
    const p2 = Math.floor(Math.random() * 6) + 1;
    
    let winner;
    if (p1 > p2) winner = ctx.pushName;
    else if (p2 > p1) winner = opponent === 'bot' ? botName : 'Opponent';
    else winner = 'Draw';

    const output = `┌──⌈ 🎲 DICE DUEL ⌋
┃ 
┃ @${ctx.sender.split('@')[0]}: [ ${p1} ]
┃ ${opponent === 'bot' ? 'AstraX' : '@' + opponent.split('@')[0]}: [ ${p2} ]
┃ 
┃ Winner: ${winner}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, opponent].filter(p => p !== 'bot') });
  }
};
