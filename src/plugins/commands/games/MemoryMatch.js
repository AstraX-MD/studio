/**
 * @fileOverview Memory Pattern Recall.
 */
const games = new Map();

export default {
  name: "memory",
  category: "games",
  description: "Test your recall by repeating a pattern of emojis.",
  usage: "memory start / memory <pattern>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const emojis = ['🍎', '🍌', '🍒', '🍇', '🍉'];

    if (args[0] === 'start') {
      const pattern = Array(4).fill(null).map(() => emojis[Math.floor(Math.random() * emojis.length)]).join('');
      games.set(ctx.sender, pattern);
      
      const { key } = await ctx.reply(`┌──⌈ 🧠 MEMORY ⌋\n┃ Pattern: ${pattern}\n┃ Status: Memorize!\n└────────────────`);
      
      setTimeout(async () => {
        await ctx.sock.sendMessage(ctx.jid, { text: `┌──⌈ 🧠 MEMORY ⌋\n┃ Gone! Now repeat the pattern.\n└────────────────`, edit: key });
      }, 2500);
      return;
    }

    const target = games.get(ctx.sender);
    if (!target) return ctx.reply("Start a game first.");

    if (args.join('') === target) {
      ctx.reply(`┌──⌈ ✅ SUCCESS ⌋\n┃ \n┃ Flawless recall!\n┃ Reward: 300 XP\n└─ 🌌 ${botName.toUpperCase()}`);
      games.delete(ctx.sender);
    } else {
      ctx.reply(`┌──⌈ ❌ FAILED ⌋\n┃ \n┃ Pattern mismatch.\n┃ Correct: ${target}\n└─ 🌌 ${botName.toUpperCase()}`);
      games.delete(ctx.sender);
    }
  }
};
