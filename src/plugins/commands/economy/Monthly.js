/**
 * @fileOverview Claim monthly rewards.
 */
export default {
  name: "monthly",
  category: "economy",
  description: "Claim your monthly enterprise bonus of $250,000.",
  usage: "monthly",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, lastMonthly: 0 };

    const now = Date.now();
    const wait = 30 * 24 * 60 * 60 * 1000;

    if (now - economy.lastMonthly < wait) {
      return ctx.reply(`┌──⌈ ⏳ ON COOLDOWN ⌋\n┃ \n┃ Bonus already claimed this month.\n└────────────────`);
    }

    const reward = 250000;
    economy.wallet += reward;
    economy.lastMonthly = now;
    await ctx.bot.db.set('economy', userId, economy);

    ctx.reply(`┌──⌈ 🏢 MONTHLY BONUS ⌋\n┃ \n┃ Reward: $${reward.toLocaleString()}\n┃ Status: ISSUED\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
