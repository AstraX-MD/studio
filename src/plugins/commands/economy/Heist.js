/**
 * @fileOverview High stakes bank heist.
 */
export default {
  name: "heist",
  category: "economy",
  description: "Execute a high-stakes heist for massive rewards.",
  usage: "heist",
  cooldown: 3600, // 1 Hour
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0 };

    if (economy.wallet < 5000) return ctx.reply("┌──⌈ 🔫 HEIST ⌋\n┃ \n┃ You need at least $5,000 to buy gear.\n└────────────────");

    const success = Math.random() > 0.8;
    if (success) {
      const jackpot = Math.floor(Math.random() * 50000) + 10000;
      economy.wallet += jackpot;
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 💰 GRAND HEIST ⌋\n┃ \n┃ Success! You hit the main vault.\n┃ Payout: $${jackpot.toLocaleString()}\n┃ Status: ELITE CRIMINAL\n└─ 🌌 ${botName.toUpperCase()}`);
    } else {
      const lost = Math.floor(economy.wallet * 0.3);
      economy.wallet -= lost;
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 🚨 HEIST FAILED ⌋\n┃ \n┃ You were intercepted by Warden Guard!\n┃ Lost Gear & Bail: $${lost.toLocaleString()}\n┃ Status: RECOVERING\n└─ 🌌 ${botName.toUpperCase()}`);
    }
  }
};
