/**
 * @fileOverview Fishing minigame.
 */
export default {
  name: "fish",
  category: "economy",
  description: "Go fishing for rewards.",
  usage: "fish",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, inventory: [] };

    if (!economy.inventory?.includes('rod')) {
      return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ You need a ROD to fish!\n┃ Buy one in the !shop.\n└────────────────");
    }

    const reward = Math.floor(Math.random() * 500) + 100;
    economy.wallet += reward;
    await ctx.bot.db.set('economy', userId, economy);

    ctx.reply(`┌──⌈ 🎣 FISHING ⌋\n┃ \n┃ You caught a Big Tuna!\n┃ Value: $${reward.toLocaleString()}\n┃ Wallet: $${economy.wallet.toLocaleString()}\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
