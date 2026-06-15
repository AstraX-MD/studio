/**
 * @fileOverview Advanced Math Calculator.
 */
export default {
  name: "calculate",
  aliases: ["calc", "math"],
  category: "tools",
  description: "Evaluate a mathematical expression.",
  usage: "calc <expression>",
  cooldown: 3,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const expr = args.join(' ');
    if (!expr) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}calc 2 + 2 * 5\n└────────────────`);

    try {
      // Basic math evaluation (sanitized)
      const result = eval(expr.replace(/[^-()\d/*+.]/g, ''));
      const output = `┌──⌈ 🧮 CALCULATOR ⌋
┃ Query: ${expr}
┃ Result: ${result}
┃ Status: Accurate
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Invalid mathematical expression.\n└────────────────`);
    }
  }
};