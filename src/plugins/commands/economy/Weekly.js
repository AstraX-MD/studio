/**
 * @fileOverview Claim weekly rewards.
 */
export default {
  name: "weekly",
  category: "economy",
  description: "Claim your weekly stipend of $50,000.",
  usage: "weekly",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, lastWeekly: 0 };

    const now = Date.now();
    const wait = 7 * 24 * 60 * 60 * 1000;

    if (now - economy.lastWeekly < wait) {
      const remaining = wait - (now - economy.lastWeekly);
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return ctx.reply(`┌──⌈ ⏳ ON COOLDOWN ⌋\n┃ \n┃ Claimed recently.\n┃ Return in: ${days}d ${hours}h\n└────────────────`);
    }

    const reward = 50000;
    economy.wallet += reward;
    economy.lastWeekly = now;
    await ctx.bot.db.set('economy', userId, economy);

    ctx.reply(`┌──⌈ 🗓️ WEEKLY CLAIM ⌋\n┃ \n┃ Reward: $${reward.toLocaleString()}\n┃ Status: CREDITED\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
