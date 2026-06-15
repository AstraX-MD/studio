/**
 * @fileOverview Claim daily rewards with time persistence.
 */
export default {
  name: "daily",
  category: "economy",
  description: "Claim your daily allowance of $5,000.",
  usage: "daily",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, bank: 0, lastDaily: 0 };

    const now = Date.now();
    const wait = 24 * 60 * 60 * 1000; // 24 Hours

    if (now - economy.lastDaily < wait) {
      const remaining = wait - (now - economy.lastDaily);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      
      return ctx.reply(`┌──⌈ ⏳ ON COOLDOWN ⌋\n┃ \n┃ You already claimed today.\n┃ Return in: ${hours}h ${mins}m\n└────────────────`);
    }

    const reward = 5000;
    economy.wallet += reward;
    economy.lastDaily = now;
    await ctx.bot.db.set('economy', userId, economy);

    const output = `┌──⌈ 🎁 DAILY CLAIM ⌋
┃ 
┃ Reward: $${reward.toLocaleString()}
┃ Status: DEPOSITED
┃ Wallet: $${economy.wallet.toLocaleString()}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
