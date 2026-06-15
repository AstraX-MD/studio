/**
 * @fileOverview Slot machine game.
 */
export default {
  name: "slots",
  category: "economy",
  description: "Play the slot machine.",
  usage: "slots <amount>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0 };

    const amount = parseInt(args[0]);
    if (!amount || amount <= 0 || amount > economy.wallet) return ctx.reply("┌──⌈ 🎰 SLOTS ⌋\n┃ Bet invalid or too high.\n└────────────────");

    const emojis = ['🍒', '💎', '🔔', '🍎', '🍋', '7️⃣'];
    const s1 = emojis[Math.floor(Math.random() * emojis.length)];
    const s2 = emojis[Math.floor(Math.random() * emojis.length)];
    const s3 = emojis[Math.floor(Math.random() * emojis.length)];

    let win = false;
    let multiplier = 0;

    if (s1 === s2 && s2 === s3) {
      win = true;
      multiplier = 5;
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      win = true;
      multiplier = 2;
    }

    if (win) {
      const prize = amount * multiplier;
      economy.wallet += (prize - amount);
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 🎰 SLOTS ⌋\n┃ \n┃ [ ${s1} | ${s2} | ${s3} ]\n┃ \n┃ JACKPOT: $${prize.toLocaleString()}!\n└─ 🌌 ${botName.toUpperCase()}`);
    } else {
      economy.wallet -= amount;
      await ctx.bot.db.set('economy', userId, economy);
      ctx.reply(`┌──⌈ 🎰 SLOTS ⌋\n┃ \n┃ [ ${s1} | ${s2} | ${s3} ]\n┃ \n┃ Result: YOU LOST\n└─ 🌌 ${botName.toUpperCase()}`);
    }
  }
};
