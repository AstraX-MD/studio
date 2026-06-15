/**
 * @fileOverview Economy leaderboard.
 */
export default {
  name: "leaderboard",
  aliases: ["lb", "rich", "top"],
  category: "economy",
  description: "View the wealthiest users on the bot.",
  usage: "leaderboard",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const all = await ctx.bot.db.all('economy');
    
    const sorted = Object.keys(all)
      .map(id => ({ id, total: (all[id].wallet || 0) + (all[id].bank || 0) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    let output = `┌──⌈ 🏆 WEALTH BOARD ⌋\n┃\n`;
    sorted.forEach((u, i) => {
      output += `├─ ${i + 1}. @${u.id}\n┃    💰 $${u.total.toLocaleString()}\n┃\n`;
    });
    output += `└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: sorted.map(u => u.id + '@s.whatsapp.net') });
  }
};
