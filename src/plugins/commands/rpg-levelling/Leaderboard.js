/**
 * @fileOverview XP Leaderboard for global rankings.
 */
export default {
  name: "rpglb",
  aliases: ["topxp", "xpleaderboard"],
  category: "rpg-levelling",
  description: "Display the highest ranking members by XP.",
  usage: "rpglb",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const all = await ctx.bot.db.all('rpg_stats');
    
    const sorted = Object.keys(all)
      .map(id => ({ id, xp: all[id].xp || 0 }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);

    if (sorted.length === 0) return ctx.reply("┌──⌈ ⚔️ LEADERBOARD ⌋\n┃ No RPG data found yet.\n└────────────────");

    let output = `┌──⌈ 🏆 ELITE HALL ⌋\n┃ Top XP Earners\n┃\n`;
    sorted.forEach((u, i) => {
      const level = Math.floor(Math.sqrt(u.xp / 100));
      output += `├─ ${i + 1}. @${u.id}\n┃    ✨ Lvl: ${level} | XP: ${u.xp.toLocaleString()}\n┃\n`;
    });
    output += `└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: sorted.map(u => u.id + '@s.whatsapp.net') });
  }
};
