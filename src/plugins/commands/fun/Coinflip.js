/**
 * @fileOverview Flip a coin.
 */
export default {
  name: "coinflip",
  aliases: ["flip", "toss"],
  category: "fun",
  description: "Flip a coin to decide Heads or Tails.",
  usage: "coinflip",
  cooldown: 3,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const side = Math.random() > 0.5 ? 'HEADS' : 'TAILS';

    const output = `┌──⌈ 🪙 COIN FLIP ⌋
┃ 
┃ Result: ${side}
┃ Status: DECIDED
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
