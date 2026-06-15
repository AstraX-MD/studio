/**
 * @fileOverview Zodiac persona audit.
 */
export default {
  name: "zodiac",
  category: "fun-advanced",
  description: "Get a detailed persona audit based on a zodiac sign.",
  usage: "zodiac <sign>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const sign = args[0]?.toLowerCase();
    if (!sign) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Provide a sign (e.g. Leo)\n└────────────────");

    const traits = {
      leo: "Bold, Intelligent, Natural Leader",
      scorpio: "Mysterious, Powerful, Loyal",
      aries: "Energetic, Honest, Brave"
    };

    const output = `┌──⌈ ♈ PERSONA AUDIT ⌋
┃ 
┃ Sign: ${sign.toUpperCase()}
┃ Traits: ${traits[sign] || 'Strong, Unique, Complex'}
┃ 
├─⊷ Element: FIRE
├─⊷ Status: DOMINANT
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
