/**
 * @fileOverview Check owned items.
 */
export default {
  name: "inventory",
  aliases: ["inv"],
  category: "economy",
  description: "View your owned items and assets.",
  usage: "inventory",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const data = await ctx.bot.db.get('economy', userId) || { inventory: [] };

    const items = data.inventory || [];

    let output = `┌──⌈ 🎒 INVENTORY ⌋\n┃ User: @${userId}\n┃\n`;
    if (items.length === 0) output += "┃ Empty. Go buy something!\n";
    else items.forEach((it, i) => output += `├─ ${i + 1}. ${it.toUpperCase()}\n`);
    
    output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output, { mentions: [ctx.sender] });
  }
};
