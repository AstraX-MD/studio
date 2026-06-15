/**
 * @fileOverview Mining minigame.
 */
export default {
  name: "mine",
  category: "economy",
  description: "Mine for precious minerals and cash.",
  usage: "mine",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, inventory: [] };

    if (!economy.inventory?.includes('pickaxe')) {
      return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ You need a PICKAXE to mine!\n┃ Buy one in the !shop.\n└────────────────");
    }

    const reward = Math.floor(Math.random() * 800) + 200;
    economy.wallet += reward;
    await ctx.bot.db.set('economy', userId, economy);

    ctx.reply(`┌──⌈ ⛏️ MINING ⌋\n┃ \n┃ You found Coal & Iron!\n┃ Yield: $${reward.toLocaleString()}\n┃ Wallet: $${economy.wallet.toLocaleString()}\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
