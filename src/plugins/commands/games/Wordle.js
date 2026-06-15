/**
 * @fileOverview Wordle Engine for WhatsApp.
 */
const games = new Map();
const pool = ['REACT', 'STORM', 'APPLE', 'GRAPE', 'SMART', 'CLOUD', 'NODES', 'BLOCK', 'SHIFT', 'PROXY'];

export default {
  name: "wordle",
  category: "games",
  description: "Guess the hidden 5-letter word.",
  usage: "wordle start / wordle guess <word>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sub = args[0]?.toLowerCase();

    if (sub === 'start') {
      const target = pool[Math.floor(Math.random() * pool.length)];
      games.set(ctx.jid, { target, tries: 0, history: [] });
      return ctx.reply(`┌──⌈ 🟩 WORDLE ⌋\n┃ \n┃ 5-letter word set!\n┃ Max Tries: 6\n┃ \n┃ Use ${prefix}wordle guess <word>\n└────────────────`);
    }

    if (sub === 'guess') {
      const game = games.get(ctx.jid);
      if (!game) return ctx.reply("Start a game first.");
      
      const guess = args[1]?.toUpperCase();
      if (!guess || guess.length !== 5) return ctx.reply("Guess must be 5 letters.");

      game.tries++;
      let result = '';
      for (let i = 0; i < 5; i++) {
        if (guess[i] === game.target[i]) result += '🟩';
        else if (game.target.includes(guess[i])) result += '🟨';
        else result += '⬛';
      }
      game.history.push(`${result} ${guess}`);

      if (guess === game.target) {
        const res = `┌──⌈ 🏆 GENIUS ⌋\n┃ \n┃ ${game.history.join('\n┃ ')}\n┃ \n┃ Word: ${game.target}\n┃ Result: SOLVED!\n└─ 🌌 ${botName.toUpperCase()}`;
        games.delete(ctx.jid);
        return ctx.reply(res);
      }

      if (game.tries >= 6) {
        const res = `┌──⌈ ❌ FAILED ⌋\n┃ \n┃ ${game.history.join('\n┃ ')}\n┃ \n┃ Word: ${game.target}\n┃ Status: TERMINATED\n└─ 🌌 ${botName.toUpperCase()}`;
        games.delete(ctx.jid);
        return ctx.reply(res);
      }

      ctx.reply(`┌──⌈ 🟩 WORDLE ⌋\n┃ Tries: ${game.tries}/6\n┃\n┃ ${game.history.join('\n┃ ')}\n└────────────────`);
    }
  }
};
