/**
 * @fileOverview Word Scramble Game.
 */
const games = new Map();
const pool = ['DEVELOPER', 'WHATSAPP', 'FIREBASE', 'MONGODB', 'PROGRAMMING', 'ASTRAX', 'ENTERPRISE', 'DATABASE', 'NETWORK', 'SECURITY'];

export default {
  name: "scramble",
  aliases: ["unscramble", "ws"],
  category: "games",
  description: "Unscramble the letters to find the correct word.",
  usage: "scramble start / scramble guess <word>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sub = args[0]?.toLowerCase();

    if (sub === 'start') {
      const target = pool[Math.floor(Math.random() * pool.length)];
      const scrambled = target.split('').sort(() => Math.random() - 0.5).join('');
      games.set(ctx.jid, target);
      
      const output = `┌──⌈ 🧩 SCRAMBLE ⌋
┃ 
┃ Scrambled: ${scrambled}
┃ Hint: Length ${target.length}
┃ 
┃ Use ${prefix}scramble guess <word>
└────────────────`;
      return ctx.reply(output);
    }

    if (sub === 'guess') {
      const target = games.get(ctx.jid);
      if (!target) return ctx.reply(`Start a game first with ${prefix}scramble start`);
      
      const guess = args[1]?.toUpperCase();
      if (guess === target) {
        ctx.reply(`┌──⌈ ✅ CORRECT ⌋\n┃ \n┃ Winner: @${ctx.sender.split('@')[0]}\n┃ Word: ${target}\n┃ Reward: 200 XP\n└─ 🌌 ${botName.toUpperCase()}`, { mentions: [ctx.sender] });
        games.delete(ctx.jid);
      } else {
        ctx.reply("❌ Incorrect. Try again!");
      }
    }
  }
};
