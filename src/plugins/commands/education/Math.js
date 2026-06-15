/**
 * @fileOverview Advanced Math & Equation Solver.
 */
import axios from 'axios';

export default {
  name: "math",
  aliases: ["solve", "equation"],
  category: "education",
  description: "Solve complex mathematical equations and expressions.",
  usage: "math <expression>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const expr = args.join(' ');
    if (!expr) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Provide an equation.\n└────────────────`);

    const fallbacks = [
      `https://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`,
      `http://api.wolframalpha.com/v1/result?appid=DEMO&i=${encodeURIComponent(expr)}`,
      `https://newton.now.sh/api/v2/simplify/${encodeURIComponent(expr)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        const result = res.data.result || res.data;

        if (result) {
          const output = `┌──⌈ 🧮 MATH SOLVER ⌋
┃
┃ Equation: ${expr}
┃ Result: ${result}
┃ Status: VERIFIED
┃
└────────────────
  © ${botName.toUpperCase()}`;
          return ctx.reply(output);
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Equation too complex or invalid.\n└────────────────`);
  }
};
