/**
 * @fileOverview Reset progress for permanent benefits.
 */
export default {
  name: "prestige",
  category: "rpg-levelling",
  description: "Reset your Level for a permanent multiplier (Requires Lvl 100).",
  usage: "prestige",
  cooldown: 30,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const stats = await ctx.bot.db.get('rpg_stats', userId) || { xp: 0, prestige: 0 };
    
    const level = Math.floor(Math.sqrt(stats.xp / 100));

    if (level < 100) {
      return ctx.reply(`┌──⌈ 🔒 PRESTIGE ⌋\n┃ \n┃ Required: Level 100\n┃ Current: Level ${level}\n└────────────────`);
    }

    const output = `┌──⌈ 🌌 ASCENSION ⌋
┃ 
┃ User: @${userId}
┃ Level: 100 ➔ 0
┃ Prestige: ${ (stats.prestige || 0) + 1 }
┃ 
├─⊷ Status: ASCENDED
├─⊷ Reward: 2x XP Multiplier
┃ 
┃ You have evolved.
└────────────────
  © ${botName.toUpperCase()}`;

    stats.xp = 0;
    stats.prestige = (stats.prestige || 0) + 1;
    await ctx.bot.db.set('rpg_stats', userId, stats);

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender] });
  }
};
