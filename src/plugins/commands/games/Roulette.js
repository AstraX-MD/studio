/**
 * @fileOverview Roulette Casino Game.
 */
export default {
  name: "roulette",
  category: "games",
  description: "Spin the roulette wheel.",
  usage: "roulette <color/number>",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const bet = args[0]?.toLowerCase();
    if (!bet) return ctx.reply("Bet on 'red', 'black', or a number (0-36).");

    const result = Math.floor(Math.random() * 37);
    const color = result === 0 ? 'green' : result % 2 === 0 ? 'red' : 'black';

    let win = false;
    if (bet === color) win = true;
    if (parseInt(bet) === result) win = true;

    const output = `┌──⌈ 🎡 ROULETTE ⌋
┃ 
┃ Wheel Spin: ${result} (${color.toUpperCase()})
┃ Your Bet: ${bet.toUpperCase()}
┃ 
┃ Result: ${win ? '💰 WINNER!' : '💸 YOU LOST'}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
