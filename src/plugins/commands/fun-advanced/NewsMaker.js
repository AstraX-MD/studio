/**
 * @fileOverview Fake Breaking News Generator.
 */
export default {
  name: "newsprank",
  aliases: ["fakebreaking", "headline"],
  category: "fun-advanced",
  description: "Generate a 'Breaking News' report template.",
  usage: "newsprank <headline>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const headline = args.join(' ');
    if (!headline) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Headline required.\n└────────────────");

    const output = `┌──⌈ 🚨 BREAKING NEWS ⌋
┃ 
┃ 🔴 LIVE: ASTRAX CHANNEL 7
┃ 
┃ [ ${headline.toUpperCase()} ]
┃ 
├─⊷ Location: GLOBAL
├─⊷ Source: VERIFIED
┃ 
┃ Stay tuned for more details.
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
