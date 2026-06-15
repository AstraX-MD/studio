/**
 * @fileOverview Beg for spare change.
 */
export default {
  name: "beg",
  category: "economy",
  description: "Beg for a few coins from the streets.",
  usage: "beg",
  cooldown: 60,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0 };

    const reward = Math.floor(Math.random() * 100) + 10;
    economy.wallet += reward;
    await ctx.bot.db.set('economy', userId, economy);

    const output = `┌──⌈ 🥺 BEGGING ⌋
┃ 
┃ Result: A stranger gave you $${reward}.
┃ Status: GRATEFUL
┃ Wallet: $${economy.wallet.toLocaleString()}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
