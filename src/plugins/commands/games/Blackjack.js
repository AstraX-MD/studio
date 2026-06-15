/**
 * @fileOverview Blackjack (21) Game.
 */
const games = new Map();

export default {
  name: "blackjack",
  aliases: ["bj", "21"],
  category: "games",
  description: "Play Blackjack against the bot dealer.",
  usage: "bj start / bj hit / bj stand",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const sub = args[0]?.toLowerCase();

    if (sub === 'start') {
      const game = {
        player: [draw(), draw()],
        dealer: [draw(), draw()],
      };
      games.set(ctx.jid, game);
      const output = `┌──⌈ 🃏 BLACKJACK ⌋
┃ 
┃ Your Hand: ${game.player.join(', ')} (${sum(game.player)})
┃ Dealer Hand: ${game.dealer[0]}, ❓
┃ 
┃ Use ${prefix}bj hit or stand
└────────────────`;
      return ctx.reply(output);
    }

    const game = games.get(ctx.jid);
    if (!game) return ctx.reply("Start a game first.");

    if (sub === 'hit') {
      game.player.push(draw());
      const total = sum(game.player);
      if (total > 21) {
        ctx.reply(`┌──⌈ 💥 BUSTED ⌋\n┃ Hand: ${game.player.join(', ')}\n┃ Total: ${total}\n┃ Result: Dealer Wins!\n└────────────────`);
        games.delete(ctx.jid);
      } else {
        ctx.reply(`┌──⌈ 🃏 BLACKJACK ⌋\n┃ Hand: ${game.player.join(', ')}\n┃ Total: ${total}\n└────────────────`);
      }
    }

    if (sub === 'stand') {
      while(sum(game.dealer) < 17) game.dealer.push(draw());
      const p = sum(game.player);
      const d = sum(game.dealer);
      let res;
      if (d > 21 || p > d) res = 'YOU WIN!';
      else if (p === d) res = "IT'S A DRAW";
      else res = 'DEALER WINS';

      const output = `┌──⌈ 🏁 FINAL ⌋
┃ 
┃ Your Hand: ${game.player.join(', ')} (${p})
┃ Dealer Hand: ${game.dealer.join(', ')} (${d})
┃ 
┃ Result: ${res}
└─ 🌌 ${botName.toUpperCase()}`;
      games.delete(ctx.jid);
      ctx.reply(output);
    }
  }
};

function draw() { return Math.floor(Math.random() * 10) + 1; }
function sum(arr) { return arr.reduce((a, b) => a + b, 0); }
