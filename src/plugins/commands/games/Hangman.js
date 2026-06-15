/**
 * @fileOverview Hangman Word Game.
 */
const games = new Map();
const words = ['JAVASCRIPT', 'ASTRAX', 'WHATSAPP', 'FIREBASE', 'BOT', 'NODEJS', 'REACT', 'NEXTJS', 'SERVER', 'TERMINAL'];

export default {
  name: "hangman",
  aliases: ["hm"],
  category: "games",
  description: "Guess the hidden word before you are hanged.",
  usage: "hangman start / hangman guess <letter>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sub = args[0]?.toLowerCase();

    if (sub === 'start') {
      const word = words[Math.floor(Math.random() * words.length)];
      const game = {
        word,
        display: Array(word.length).fill('_'),
        mistakes: 0,
        used: []
      };
      games.set(ctx.jid, game);
      return ctx.reply(`┌──⌈ 💀 HANGMAN ⌋\n┃\n┃ Word: ${game.display.join(' ')}\n┃ Mistakes: 0/6\n┃\n┃ Use ${prefix}hm guess <letter>\n└────────────────`);
    }

    if (sub === 'guess') {
      const game = games.get(ctx.jid);
      if (!game) return ctx.reply("Start a game first.");
      
      const letter = args[1]?.toUpperCase();
      if (!letter || letter.length !== 1) return ctx.reply("Provide one letter.");
      if (game.used.includes(letter)) return ctx.reply("Already used.");

      game.used.push(letter);
      if (game.word.includes(letter)) {
        for (let i = 0; i < game.word.length; i++) {
          if (game.word[i] === letter) game.display[i] = letter;
        }
      } else {
        game.mistakes++;
      }

      if (!game.display.includes('_')) {
        const res = `┌──⌈ 🏆 SAVED ⌋\n┃ \n┃ Word: ${game.word}\n┃ Result: YOU SURVIVED!\n└─ 🌌 ${botName.toUpperCase()}`;
        games.delete(ctx.jid);
        return ctx.reply(res);
      }

      if (game.mistakes >= 6) {
        const res = `┌──⌈ 💀 HANGED ⌋\n┃ \n┃ Word: ${game.word}\n┃ Result: YOU DIED\n└─ 🌌 ${botName.toUpperCase()}`;
        games.delete(ctx.jid);
        return ctx.reply(res);
      }

      ctx.reply(`┌──⌈ 💀 HANGMAN ⌋\n┃\n┃ Word: ${game.display.join(' ')}\n┃ Mistakes: ${game.mistakes}/6\n┃ Used: ${game.used.join(', ')}\n└────────────────`);
    }
  }
};
