/**
 * @fileOverview Move cash from wallet to bank.
 */
export default {
  name: "deposit",
  aliases: ["dep"],
  category: "economy",
  description: "Move money from your wallet into your secure bank account.",
  usage: "deposit <amount/all>",
  cooldown: 3,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, bank: 0 };

    let amount = args[0];
    if (!amount) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Specify amount or 'all'.\n└────────────────");

    if (amount === 'all') amount = economy.wallet;
    else amount = parseInt(amount);

    if (isNaN(amount) || amount <= 0) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Invalid amount.\n└────────────────");
    if (amount > economy.wallet) return ctx.reply("┌──⌈ ⚠️ BANK ⌋\n┃ Insufficient wallet funds.\n└────────────────");

    economy.wallet -= amount;
    economy.bank += amount;
    await ctx.bot.db.set('economy', userId, economy);

    const output = `┌──⌈ 🏦 DEPOSIT ⌋
┃ 
┃ Amount: $${amount.toLocaleString()}
┃ Destination: BANK
┃ Status: SECURED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
