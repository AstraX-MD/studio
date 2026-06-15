/**
 * @fileOverview High stakes gambling.
 */
export default {
  name: "gamble",
  aliases: ["bet"],
  category: "economy",
  description: "Gamble your money for a chance to double it.",
  usage: "gamble <amount>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0 };

    let amount = args[0];
    if (!amount) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Specify an amount.\n└────────────────");
    
    amount = parseInt(amount);
    if (isNaN(amount) || amount <= 0) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Invalid amount.\n└────────────────");
    if (amount > economy.wallet) return ctx.reply("┌──⌈ ⚠️ CASINO ⌋\n┃ Not enough cash.\n└────────────────");

    const win = Math.random() > 0.55;
    if (win) {
      economy.wallet += amount;
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 🎰 CASINO WIN ⌋\n┃ \n┃ You won $${amount.toLocaleString()}!\n┃ Wallet: $${economy.wallet.toLocaleString()}\n└─ 🌌 ${botName.toUpperCase()}`);
    } else {
      economy.wallet -= amount;
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 📉 CASINO LOSS ⌋\n┃ \n┃ You lost $${amount.toLocaleString()}.\n┃ Wallet: $${economy.wallet.toLocaleString()}\n└─ 🌌 ${botName.toUpperCase()}`);
    }
  }
};
