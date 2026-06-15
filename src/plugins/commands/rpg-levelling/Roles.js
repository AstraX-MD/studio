/**
 * @fileOverview List available RPG titles and requirements.
 */
export default {
  name: "roles",
  aliases: ["titles", "ranks"],
  category: "rpg-levelling",
  description: "View the hierarchy of RPG titles and their requirements.",
  usage: "roles",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 🏷️ RPG HIERARCHY ⌋
┃
├─ 🛡️ NOVICE [Lvl 0+]
├─ ⚔️ ROOKIE [Lvl 10+]
├─ 🎖️ VETERAN [Lvl 20+]
├─ 🏆 ELITE [Lvl 30+]
├─ 💎 MASTER [Lvl 40+]
├─ 🔥 GRANDMASTER [Lvl 50+]
├─ 🌌 LEGEND [Lvl 70+]
┃
┃ Tip: Use !rank to check 
┃ your current progress.
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
