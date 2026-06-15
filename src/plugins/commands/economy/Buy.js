/**
 * @fileOverview Purchase items from the shop.
 */
export default {
  name: "buy",
  category: "economy",
  description: "Purchase an item from the shop.",
  usage: "buy <item>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const item = args[0]?.toLowerCase();
    if (!item) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ What are you buying?\n└────────────────");

    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, inventory: [] };

    const prices = {
      shield: 10000,
      pickaxe: 5000,
      rod: 3000,
      premium: 1000000
    };

    if (!prices[item]) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Item not in stock.\n└────────────────");
    if (economy.wallet < prices[item]) return ctx.reply("┌──⌈ 💸 ERROR ⌋\n┃ Not enough cash in wallet.\n└────────────────");

    economy.wallet -= prices[item];
    if (!economy.inventory) economy.inventory = [];
    economy.inventory.push(item);

    await ctx.bot.db.set('economy', userId, economy);
    ctx.reply(`┌──⌈ ✅ PURCHASE ⌋\n┃ \n┃ Item: ${item.toUpperCase()}\n┃ Price: $${prices[item].toLocaleString()}\n┃ Status: DELIVERED\n└─ 🌌 ${botName.toUpperCase()}`);
  }
};
