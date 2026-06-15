/**
 * @fileOverview High/Low Number Guessing.
 */
const games = new Map();

export default {
  name: "guess",
  category: "games",
  description: "Guess a secret number between 1 and 100.",
  usage: "guess start / guess <number>",
  cooldown: 2,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    if (args[0] === 'start') {
      const secret = Math.floor(Math.random() * 100) + 1;
      games.set(ctx.jid, { secret, attempts: 0 });
      return ctx.reply(`┌──⌈ 🔢 GUESS ⌋\n┃ \n┃ Secret number generated!\n┃ Range: 1 - 100\n┃ Status: READY\n└────────────────`);
    }

    const game = games.get(ctx.jid);
    if (!game) return ctx.reply(`Use ${prefix}guess start`);

    const num = parseInt(args[0]);
    if (isNaN(num)) return ctx.reply("Provide a valid number.");

    game.attempts++;
    if (num === game.secret) {
      const res = `┌──⌈ 🏆 CORRECT ⌋\n┃ \n┃ Number: ${game.secret}\n┃ Attempts: ${game.attempts}\n┃ Winner: @${ctx.sender.split('@')[0]}\n└─ 🌌 ${botName.toUpperCase()}`;
      games.delete(ctx.jid);
      return await ctx.sock.sendMessage(ctx.jid, { text: res, mentions: [ctx.sender] });
    } else if (num < game.secret) {
      ctx.reply(`┃ 📈 HIGHER! (Att: ${game.attempts})`);
    } else {
      ctx.reply(`┃ 📉 LOWER! (Att: ${game.attempts})`);
    }
  }
};
