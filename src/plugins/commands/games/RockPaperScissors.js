/**
 * @fileOverview Rock Paper Scissors (RPS).
 */
const games = new Map();

export default {
  name: "rps",
  aliases: ["suit"],
  category: "games",
  description: "Play Rock Paper Scissors with someone.",
  usage: "rps start [@tag] / rps choose <rock/paper/scissors>",
  cooldown: 2,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sub = args[0]?.toLowerCase();

    if (sub === 'start') {
      let opponent = ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 'bot';
      const game = {
        p1: ctx.sender, p2: opponent,
        p1Choice: null, p2Choice: null
      };
      games.set(ctx.jid, game);
      const output = `┌──⌈ ✊ SUIT ⌋
┃ 
┃ Challenger: @${ctx.sender.split('@')[0]}
┃ Target: ${opponent === 'bot' ? 'AstraX AI' : '@' + opponent.split('@')[0]}
┃ 
┃ Use ${prefix}rps choose <type>
└────────────────`;
      return await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender, opponent].filter(p => p !== 'bot') });
    }

    if (sub === 'choose') {
      const game = games.get(ctx.jid);
      if (!game) return ctx.reply("Start a game first.");
      
      const choice = args[1]?.toLowerCase();
      const valid = ['rock', 'paper', 'scissors'];
      if (!valid.includes(choice)) return ctx.reply("Invalid choice.");

      if (ctx.sender === game.p1) game.p1Choice = choice;
      else if (ctx.sender === game.p2) game.p2Choice = choice;
      else return ctx.reply("You are not in this game.");

      if (game.p2 === 'bot') {
        game.p2Choice = valid[Math.floor(Math.random() * 3)];
      }

      if (game.p1Choice && game.p2Choice) {
        const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };
        let winner;
        if (game.p1Choice === game.p2Choice) winner = 'Draw';
        else if (
          (game.p1Choice === 'rock' && game.p2Choice === 'scissors') ||
          (game.p1Choice === 'paper' && game.p2Choice === 'rock') ||
          (game.p1Choice === 'scissors' && game.p2Choice === 'paper')
        ) winner = 'p1';
        else winner = 'p2';

        const result = `┌──⌈ 🏁 RESULTS ⌋
┃ 
┃ @${game.p1.split('@')[0]}: ${emojis[game.p1Choice]}
┃ ${game.p2 === 'bot' ? 'AstraX AI' : '@' + game.p2.split('@')[0]}: ${emojis[game.p2Choice]}
┃ 
┃ Outcome: ${winner === 'Draw' ? "It's a Tie!" : winner === 'p1' ? 'Challenger Wins!' : 'Target Wins!'}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
        games.delete(ctx.jid);
        return await ctx.sock.sendMessage(ctx.jid, { text: result, mentions: [game.p1, game.p2].filter(p => p !== 'bot') });
      }
      ctx.reply("Choice recorded. Waiting for opponent...");
    }
  }
};
