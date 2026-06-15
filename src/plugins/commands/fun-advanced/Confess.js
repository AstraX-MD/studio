/**
 * @fileOverview Anonymous confession template.
 */
export default {
  name: "confess",
  aliases: ["confession"],
  category: "fun-advanced",
  description: "Create a framed anonymous confession.",
  usage: "confess <message>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const msg = args.join(' ');
    if (!msg) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Confession content missing.\n└────────────────");

    const output = `┌──⌈ 🕵️ ANONYMOUS ⌋
┃ 
┃ " ${msg} "
┃ 
├─⊷ Sender: HIDDEN
├─⊷ Status: PUBLISHED
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
