/**
 * @fileOverview Move cash from bank to wallet.
 */
export default {
  name: "withdraw",
  aliases: ["with"],
  category: "economy",
  description: "Move money from your bank into your wallet.",
  usage: "withdraw <amount/all>",
  cooldown: 3,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, bank: 0 };

    let amount = args[0];
    if (!amount) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Specify amount or 'all'.\n└────────────────");

    if (amount === 'all') amount = economy.bank;
    else amount = parseInt(amount);

    if (isNaN(amount) || amount <= 0) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Invalid amount.\n└────────────────");
    if (amount > economy.bank) return ctx.reply("┌──⌈ ⚠️ BANK ⌋\n┃ Insufficient bank funds.\n└────────────────");

    economy.bank -= amount;
    economy.wallet += amount;
    await ctx.bot.db.set('economy', userId, economy);

    const output = `┌──⌈ 🏦 WITHDRAW ⌋
┃ 
┃ Amount: $${amount.toLocaleString()}
┃ Destination: WALLET
┃ Status: READY
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
