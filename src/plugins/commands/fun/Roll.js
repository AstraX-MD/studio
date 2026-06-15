/**
 * @fileOverview Roll a dice.
 */
export default {
  name: "roll",
  aliases: ["dice"],
  category: "fun",
  description: "Roll a six-sided dice.",
  usage: "roll",
  cooldown: 3,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const roll = Math.floor(Math.random() * 6) + 1;

    const output = `┌──⌈ 🎲 DICE ROLL ⌋
┃ 
┃ Result: ${roll}
┃ Status: RANDOMIZED
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
