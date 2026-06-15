/**
 * @fileOverview Perform risky crimes for money.
 */
export default {
  name: "crime",
  category: "economy",
  description: "Commit a random crime for a chance at high rewards.",
  usage: "crime",
  cooldown: 30,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0 };

    const crimes = [
      { name: "Pickpocketing", reward: 500, risk: 0.4 },
      { name: "Bank Hack", reward: 5000, risk: 0.7 },
      { name: "Shop Lifting", reward: 1000, risk: 0.5 }
    ];

    const crime = crimes[Math.floor(Math.random() * crimes.length)];
    const success = Math.random() > crime.risk;

    if (success) {
      economy.wallet += crime.reward;
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 😈 CRIME SUCCESS ⌋\n┃ \n┃ You committed ${crime.name}!\n┃ Profit: $${crime.reward.toLocaleString()}\n┃ Status: WANTED\n└─ 🌌 ${botName.toUpperCase()}`);
    } else {
      const fine = Math.floor(crime.reward / 2);
      economy.wallet = Math.max(0, economy.wallet - fine);
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 🚔 BUSTED ⌋\n┃ \n┃ Failed to commit ${crime.name}.\n┃ Fine Paid: $${fine.toLocaleString()}\n┃ Status: JAILED\n└─ 🌌 ${botName.toUpperCase()}`);
    }
  }
};
