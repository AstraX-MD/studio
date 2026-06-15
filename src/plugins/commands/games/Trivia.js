/**
 * @fileOverview Trivia Quiz Game.
 */
import axios from 'axios';

const games = new Map();

export default {
  name: "trivia",
  aliases: ["quiz"],
  category: "games",
  description: "Answer general knowledge trivia questions.",
  usage: "trivia start / trivia answer <text>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sub = args[0]?.toLowerCase();

    if (sub === 'start') {
      try {
        const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        const q = res.data.results[0];
        const options = [...q.incorrect_answers, q.correct_answer].sort();

        const game = { answer: q.correct_answer.toLowerCase() };
        games.set(ctx.jid, game);

        const output = `┌──⌈ ❓ TRIVIA ⌋
┃ 
┃ Category: ${q.category}
┃ Difficulty: ${q.difficulty.toUpperCase()}
┃ 
┃ Question: 
┃ ${q.question}
┃ 
┃ Options:
┃ - ${options.join('\n┃ - ')}
┃ 
┃ Use ${prefix}trivia answer <text>
└────────────────`;
        return ctx.reply(output);
      } catch (e) { ctx.reply("Trivia database offline."); }
    }

    if (sub === 'answer') {
      const game = games.get(ctx.jid);
      if (!game) return ctx.reply("No question active.");
      
      const ans = args.slice(1).join(' ').toLowerCase();
      if (ans === game.answer) {
        ctx.reply(`┌──⌈ ✅ CORRECT ⌋\n┃ \n┃ @${ctx.sender.split('@')[0]} got it right!\n┃ Reward: 500 XP\n└─ 🌌 ${botName.toUpperCase()}`, { mentions: [ctx.sender] });
        games.delete(ctx.jid);
      } else {
        ctx.reply("❌ Wrong. Try again or skip.");
      }
    }
  }
};
