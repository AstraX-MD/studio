/**
 * @fileOverview Item shop.
 */
export default {
  name: "shop",
  category: "economy",
  description: "View items available for purchase.",
  usage: "shop",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';

    const output = `┌──⌈ 🛒 MARKETPLACE ⌋
┃
├─ 🛡️ SHIELD ($10,000)
┃    Protect from rob
├─ ⛏️ PICKAXE ($5,000)
┃    Boost mine earnings
├─ 🎣 ROD ($3,000)
┃    Enable fishing
├─ 💎 PREMIUM ($1,000,000)
┃    Unlock elite rank
┃
├─⊷ Use ${prefix}buy <item>
└────────────────
  © ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
