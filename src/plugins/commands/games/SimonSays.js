/**
 * @fileOverview Memory Sequence Game.
 */
const games = new Map();

export default {
  name: "simon",
  category: "games",
  description: "Remember the sequence and repeat it back.",
  usage: "simon start / simon <sequence>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    if (args[0] === 'start') {
      const seq = Math.floor(1000 + Math.random() * 9000).toString();
      games.set(ctx.sender, seq);
      
      const { key } = await ctx.reply(`┌──⌈ 🔵 SIMON SAYS ⌋\n┃ Sequence: ${seq}\n┃ Status: Memorize now!\n└────────────────`);
      
      setTimeout(async () => {
        await ctx.sock.sendMessage(ctx.jid, { text: `┌──⌈ 🔵 SIMON SAYS ⌋\n┃ Time is up! Repeat it.\n┃ Use: ${prefix}simon <seq>\n└────────────────`, edit: key });
      }, 3000);
      return;
    }

    const target = games.get(ctx.sender);
    if (!target) return ctx.reply("Start a game first.");

    if (args[0] === target) {
      ctx.reply(`┌──⌈ ✅ MASTERED ⌋\n┃ \n┃ You remembered correctly!\n┃ Result: Success\n└─ 🌌 ${botName.toUpperCase()}`);
      games.delete(ctx.sender);
    } else {
      ctx.reply(`┌──⌈ ❌ FAILED ⌋\n┃ \n┃ Wrong sequence.\n┃ Correct: ${target}\n└─ 🌌 ${botName.toUpperCase()}`);
      games.delete(ctx.sender);
    }
  }
};
