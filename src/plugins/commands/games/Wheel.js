/**
 * @fileOverview Wheel of Fortune.
 */
export default {
  name: "wheel",
  aliases: ["spin"],
  category: "games",
  description: "Spin the wheel to win randomized rewards.",
  usage: "wheel",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const prizes = ['1000 XP', '500 Coins', 'Nothing', 'Jackpot ($50k)', 'Banned (Joke)', '2x Multiplier'];
    const win = prizes[Math.floor(Math.random() * prizes.length)];

    const output = `┌──⌈ 🎡 SPINNING ⌋
┃ 
┃ [ .... | ${win} | .... ]
┃ 
┃ Result: ${win}
┃ Status: CLAIMED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
