/**
 * @fileOverview Buy a lottery ticket.
 */
export default {
  name: "lottery",
  aliases: ["ticket", "lotto"],
  category: "economy",
  description: "Buy a lottery ticket for a chance to win $1,000,000.",
  usage: "lottery",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0 };

    const cost = 1000;
    if (economy.wallet < cost) return ctx.reply("┌──⌈ 🎟️ LOTTERY ⌋\n┃ \n┃ Tickets cost $1,000 each.\n└────────────────");

    economy.wallet -= cost;
    const win = Math.random() < 0.001; // 0.1% chance

    if (win) {
      const jackpot = 1000000;
      economy.wallet += jackpot;
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 🥳 JACKPOT! ⌋\n┃ \n┃ YOU WON THE LOTTERY!\n┃ Payout: $${jackpot.toLocaleString()}\n└─ 🌌 ${botName.toUpperCase()}`);
    } else {
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 🎟️ LOTTERY ⌋\n┃ \n┃ You bought a ticket for $1,000.\n┃ Result: NO WINNER\n┃ Status: Better luck next time.\n└─ 🌌 ${botName.toUpperCase()}`);
    }
  }
};
