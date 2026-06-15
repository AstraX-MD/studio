/**
 * @fileOverview Invest money into simulated stocks.
 */
export default {
  name: "invest",
  aliases: ["stocks", "market"],
  category: "economy",
  description: "Invest your money into the market for passive gains/losses.",
  usage: "invest <amount>",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0 };

    const amount = parseInt(args[0]);
    if (!amount || amount <= 0 || amount > economy.wallet) return ctx.reply("┌──⌈ 📈 MARKET ⌋\n┃ \n┃ Investment amount invalid.\n└────────────────");

    const change = (Math.random() * 0.4) - 0.15; // -15% to +25%
    const result = Math.floor(amount * (1 + change));
    
    economy.wallet = (economy.wallet - amount) + result;
    await ctx.bot.db.set('economy', userId, economy);

    const output = `┌──⌈ 📊 INVESTMENT ⌋
┃ 
┃ Principal: $${amount.toLocaleString()}
┃ Outcome: $${result.toLocaleString()}
┃ Profit/Loss: ${ (change * 100).toFixed(2) }%
┃ Status: MARKET CLOSED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
