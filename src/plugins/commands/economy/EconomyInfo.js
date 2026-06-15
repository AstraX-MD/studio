/**
 * @fileOverview Economy manual.
 */
export default {
  name: "economy",
  aliases: ["einfo"],
  category: "economy",
  description: "View documentation for the financial subsystem.",
  usage: "economy",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';

    const output = `┌──⌈ 🏦 ECONOMY V2 ⌋
┃
├─ 💳 Banking: Use ${prefix}dep, ${prefix}with
├─ 💼 Earnings: Use ${prefix}work, ${prefix}daily
├─ 🎰 Games: Use ${prefix}gamble, ${prefix}slots
├─ 🛒 Market: Use ${prefix}shop, ${prefix}buy
├─ 🔫 Crimes: Use ${prefix}rob
┃
┃ Start by claiming your 
┃ daily bonus now!
└────────────────
  © ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
