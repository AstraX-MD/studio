/**
 * @fileOverview Claim periodic salary if employed.
 */
export default {
  name: "salary",
  category: "economy",
  description: "Collect your hourly salary if you have worked recently.",
  usage: "salary",
  cooldown: 3600, // 1 Hour
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0 };

    const pay = 2000;
    economy.wallet += pay;
    await ctx.bot.db.set('economy', userId, economy);

    ctx.reply(`┌──⌈ 📄 PAYSLIP ⌋\n┃ \n┃ Hourly Wage: $${pay.toLocaleString()}\n┃ Status: DISBURSED\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
