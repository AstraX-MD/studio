/**
 * @fileOverview Ultra secure storage for funds.
 */
export default {
  name: "vault",
  category: "economy",
  description: "Store money in an un-robbable secure vault.",
  usage: "vault <amount/all>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { bank: 0, vault: 0 };

    let amount = args[0];
    if (amount === 'all') amount = economy.bank;
    else amount = parseInt(amount);

    if (!amount || amount <= 0 || amount > economy.bank) return ctx.reply("┌──⌈ 🔐 VAULT ⌋\n┃ \n┃ You can only move money from BANK to VAULT.\n└────────────────");

    economy.bank -= amount;
    economy.vault = (economy.vault || 0) + amount;
    await ctx.bot.db.set('economy', userId, economy);

    const output = `┌──⌈ 🔏 FUNDS SECURED ⌋
┃ 
┃ Moved: $${amount.toLocaleString()}
┃ Dest: ASTRAX DEEP VAULT
┃ Status: ROOB-PROOF
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
